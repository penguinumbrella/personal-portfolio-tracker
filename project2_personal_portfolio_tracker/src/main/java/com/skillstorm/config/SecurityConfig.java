package com.skillstorm.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;

@Configuration
public class SecurityConfig {

    /**
     * BCrypt is the password encoder. It auto generates a unique
     * salt for each password and stores it as part of the resulting hash. 
     * Used strength 12 to balance security with speed
     */
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    /**
     * Uses Spring Security's DaoAuthenticationProvider to authenticate users
     * against the application's UserDetailsService and verify passwords using
     * the configured PasswordEncoder.
     */
    @Bean
    AuthenticationManager authenticationManager(UserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(passwordEncoder);
        provider.setUserDetailsService(userDetailsService);
        return provider::authenticate;
    }

    /**
     * Stores the authenticated SecurityContext in the user's HTTP session.
     *
     * This allows users to remain authenticated across multiple requests
     * without needing to reauth
     * */
    @Bean
    SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    /**
     * Allows for specified endpoint permissions 
     */
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        //specify which endpoints require authentication and which don't
        http
                .authorizeHttpRequests(auth -> auth
                        // allow all traffic for new users to register and log in
                        .requestMatchers(HttpMethod.POST, "/v1/auth/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/v1/auth/login").permitAll()
                        .requestMatchers(HttpMethod.GET, "/v1/auth/csrf").permitAll()

                        // user controller endpoints are only allowed for admins
                        .requestMatchers("/v1/users/**").hasRole("ADMIN")

                        // all other requests, the user just needs to be authenticated, no role requirments
                        .anyRequest().authenticated())

                // let Spring Security's filter chain answer CORS preflight (OPTIONS) requests using
                // the CorsConfigurationSource Spring Boot derives from WebConfig's addCorsMappings,
                // instead of blocking them with a 401 before they ever reach MVC-level CORS handling
                .cors(Customizer.withDefaults())

                // get the CSRF token from the cookie and send it back in the header for all requests
                .csrf(csrf -> csrf
                        // Store the CSRF token in the XSRF-TOKEN cookie
                        // SameSite=None is required since the frontend backend are different ports/origins
                        //  -a same-site-default cookie never reaches the server on the cross-origin POST
                        //      -which creates error 401 (browser Basic-auth popup) instead of a normal CSRF failure
                        .csrfTokenRepository(csrfTokenRepository())

                        // tell spring security to look for the CSRF token in the XSRF-TOKEN cookie 
                        // and send it back in the X-XSRF-TOKEN header
                        .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler()))

                // use basic auth for all requests
                .httpBasic(Customizer.withDefaults());

        return http.build();

    }

    private CookieCsrfTokenRepository csrfTokenRepository() {
        CookieCsrfTokenRepository repository = CookieCsrfTokenRepository.withHttpOnlyFalse();
        repository.setCookieCustomizer(cookie -> cookie.sameSite("None").secure(true));
        return repository;
    }

}
