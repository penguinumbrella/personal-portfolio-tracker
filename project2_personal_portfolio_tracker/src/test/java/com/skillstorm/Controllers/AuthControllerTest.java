package com.skillstorm.Controllers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.csrf.DefaultCsrfToken;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillstorm.DTOs.LoginRequest;
import com.skillstorm.DTOs.UserDto;
import com.skillstorm.Models.RoleType;
import com.skillstorm.Models.User;
import com.skillstorm.Services.UserService;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.http.MediaType.APPLICATION_JSON;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private AuthenticationManager authenticationManager;

    @MockitoBean
    private SecurityContextRepository securityContextRepository;

    private User testUser;
    private UserDto testUserDto;

    @BeforeEach
    void dataInit() {
        testUser = new User(1, "plswork", "plswork@test.com", "hash", true, RoleType.USER);
        testUserDto = new UserDto("plswork", "plswork@test.com", "plswork");
    }

    @Nested
    @DisplayName("GET /v1/auth/csrf")
    class getCsrfToken {

        @Test
        @DisplayName("200 OK with the csrf header name and token")
        void getCsrfToken() throws Exception {
            CsrfToken csrfToken = new DefaultCsrfToken("X-XSRF-TOKEN", "_csrf", "test-token-value");

            mockMvc.perform(get("/v1/auth/csrf").requestAttr(CsrfToken.class.getName(), csrfToken))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.headerName").value("X-XSRF-TOKEN"))
                    .andExpect(jsonPath("$.token").value("test-token-value"));
        }
    }

    @Nested
    @DisplayName("POST /v1/auth/register")
    class registerNewUser {

        @Test
        @DisplayName("201 CREATED with the new user")
        void registerUser() throws Exception {
            when(userService.registerUser(testUserDto)).thenReturn(testUser);

            mockMvc.perform(post("/v1/auth/register")
                    .contentType(APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(testUserDto)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.username").value("plswork"))
                    .andExpect(jsonPath("$.email").value("plswork@test.com"))
                    .andExpect(jsonPath("$.passwordHash").doesNotExist());
        }

        @Test
        @DisplayName("409 CONFLICT when the username is already taken")
        void registerUserUsernameTaken() throws Exception {
            when(userService.registerUser(testUserDto)).thenReturn(null);

            mockMvc.perform(post("/v1/auth/register")
                    .contentType(APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(testUserDto)))
                    .andExpect(status().isConflict());
        }
    }

    @Nested
    @DisplayName("POST /v1/auth/login")
    class login {

        @Test
        @DisplayName("200 OK with the logged in user")
        void login() throws Exception {
            LoginRequest credentials = new LoginRequest("plswork", "plswork");
            Authentication authentication = new UsernamePasswordAuthenticationToken("plswork", "plswork");

            when(authenticationManager.authenticate(any())).thenReturn(authentication);
            when(userService.viewProfileByUsername("plswork")).thenReturn(testUser);

            mockMvc.perform(post("/v1/auth/login")
                    .contentType(APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(credentials)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.username").value("plswork"))
                    .andExpect(jsonPath("$.email").value("plswork@test.com"))
                    .andExpect(jsonPath("$.passwordHash").doesNotExist());

            verify(securityContextRepository).saveContext(any(), any(), any());
        }

        @Test
        @DisplayName("401 UNAUTHORIZED when credentials are invalid")
        void loginBadCredentials() throws Exception {
            LoginRequest credentials = new LoginRequest("plswork", "wrong");

            when(authenticationManager.authenticate(any())).thenThrow(new BadCredentialsException("bad credentials"));

            mockMvc.perform(post("/v1/auth/login")
                    .contentType(APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(credentials)))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("401 UNAUTHORIZED when the account is disabled")
        void loginDisabledAccount() throws Exception {
            LoginRequest credentials = new LoginRequest("plswork", "plswork");

            when(authenticationManager.authenticate(any())).thenThrow(new DisabledException("disabled"));

            mockMvc.perform(post("/v1/auth/login")
                    .contentType(APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(credentials)))
                    .andExpect(status().isUnauthorized());
        }
    }

    @Nested
    @DisplayName("GET /v1/auth/me")
    class getCurrentUser {

        @Test
        @DisplayName("200 OK with the current user")
        void getCurrentUser() throws Exception {
            Authentication authentication = new UsernamePasswordAuthenticationToken("plswork", "plswork");
            when(userService.viewProfileByUsername("plswork")).thenReturn(testUser);

            mockMvc.perform(get("/v1/auth/me").principal(authentication))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.username").value("plswork"))
                    .andExpect(jsonPath("$.email").value("plswork@test.com"))
                    .andExpect(jsonPath("$.passwordHash").doesNotExist());
        }
    }

    @Nested
    @DisplayName("PUT /v1/auth/me")
    class updateCurrentUser {

        @Test
        @DisplayName("200 OK with the updated user")
        void updateCurrentUser() throws Exception {
            Authentication authentication = new UsernamePasswordAuthenticationToken("plswork", "plswork");
            UserDto updateDto = new UserDto("diff", "diff@test.com", "diff");
            User updatedUser = new User(1, "diff", "diff@test.com", "diff", true, RoleType.USER);
            UserDetails updatedUserDetails = org.springframework.security.core.userdetails.User
                    .withUsername("diff")
                    .password("diff")
                    .authorities("ROLE_USER")
                    .build();

            when(userService.viewProfileByUsername("plswork")).thenReturn(testUser);
            when(userService.updateProfile(1, updateDto)).thenReturn(updatedUser);
            when(userService.loadUserByUsername("diff")).thenReturn(updatedUserDetails);

            mockMvc.perform(put("/v1/auth/me")
                    .principal(authentication)
                    .contentType(APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updateDto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.username").value("diff"))
                    .andExpect(jsonPath("$.email").value("diff@test.com"))
                    .andExpect(jsonPath("$.passwordHash").doesNotExist());

            verify(securityContextRepository).saveContext(any(), any(), any());
        }
    }

    @Nested
    @DisplayName("POST /v1/auth/logout")
    class logout {

        @Test
        @DisplayName("204 NO CONTENT and clears the session")
        void logout() throws Exception {
            mockMvc.perform(post("/v1/auth/logout").session(new org.springframework.mock.web.MockHttpSession()))
                    .andExpect(status().isNoContent());
        }

        @Test
        @DisplayName("204 NO CONTENT when there is no active session")
        void logoutNoSession() throws Exception {
            mockMvc.perform(post("/v1/auth/logout"))
                    .andExpect(status().isNoContent());
        }
    }

}
