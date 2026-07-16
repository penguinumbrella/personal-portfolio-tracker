package com.skillstorm.Controllers;

import org.springframework.web.bind.annotation.RestController;

import com.skillstorm.DTOs.LoginRequest;
import com.skillstorm.DTOs.UserDto;
import com.skillstorm.Models.User;
import com.skillstorm.Services.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/v1/auth")
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;

    public AuthController(UserService userService, AuthenticationManager authenticationManager,
            SecurityContextRepository securityContextRepository) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.securityContextRepository = securityContextRepository;
    }

    /**
     * Returns the current CSRF token information.
     *
     * token  requested by frontend apps and included in 
     * state-changing requests (POST, PUT, DELETE) to protect
     * against Cross-Site Request Forgery attacks
     *
     * @param csrf the CSRF token automatically injected by Spring Security
     * @return a map containing the header name and token value
     */
    @GetMapping("/csrf")
    public ResponseEntity<Map<String, String>> getCsrfToken(CsrfToken csrf) {
        Map<String, String> body = new LinkedHashMap<>();

        // Spring Security can auto-inject values to your methods and you can use those values as necessary
        body.put("headerName", csrf.getHeaderName());
        body.put("token", csrf.getToken());
        return ResponseEntity.ok(body);
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerNewUser(@Valid @RequestBody UserDto registeringUser) {

        User createdUser = userService.registerUser(registeringUser);
        if (createdUser == null) {
            // return 409 - CONFLICT if the username already exists
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    /**
    * Authenticates a user and creates a session-based login.
    *
    * If auth succeeds, the authenticated SecurityContext
    * is stored in the HTTP session so future requests can be recognized as
    * authenticated without resending credentials
    *
    * @param credentials username and password supplied by client
    * @param request the current HTTP request
    * @param response the current HTTP response
    * @return the authenticated user's profile, or HTTP 401 if auth fails
    */
    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody LoginRequest credentials, HttpServletRequest request,
            HttpServletResponse response) {
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(credentials.username(), credentials.password()));
        } catch (BadCredentialsException | DisabledException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        /**
         * persist the authenticated context into the session so later requests (carrying the
         * session cookie) are recognized as logged in without needing to resend credentials
         */
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, request, response);

        User user = userService.viewProfileByUsername(credentials.username());
        return ResponseEntity.ok(user);
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        User user = userService.viewProfileByUsername(authentication.getName());
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateCurrentUser(Authentication authentication, @Valid @RequestBody UserDto dto,
            HttpServletRequest request, HttpServletResponse response) {
        User currentUser = userService.viewProfileByUsername(authentication.getName());
        User updated = userService.updateProfile(currentUser.getId(), dto);

        // the username may have changed, so the session's principal must be refreshed or
        // subsequent requests will look up the old (now nonexistent) username and 404
        UserDetails userDetails = userService.loadUserByUsername(updated.getUsername());
        Authentication newAuthentication = new UsernamePasswordAuthenticationToken(
                userDetails, authentication.getCredentials(), userDetails.getAuthorities());
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(newAuthentication);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, request, response);

        return ResponseEntity.ok(updated);
    }

    /**
     * Logs out the current user.
     *
     * Invalidates the HTTP session and clears the Spring
     * Security context so user is no longer authenticated
     *
     * @param request the current HTTP request
     * @return HTTP 204 No Content
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.noContent().build();
    }

}
