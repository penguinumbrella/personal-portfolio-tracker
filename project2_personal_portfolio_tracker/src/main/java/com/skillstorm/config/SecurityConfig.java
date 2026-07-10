package com.skillstorm.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;

@Configuration
public class SecurityConfig {

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        //specify which endpoints require authentication and which don't
        http
                .authorizeHttpRequests(auth -> auth
                        // allow all traffic for new users to register
                        .requestMatchers(HttpMethod.POST, "/v1/auth/register").permitAll()
                        .requestMatchers(HttpMethod.GET, "/v1/auth/csrf").permitAll()

                        // user controller endpoints are only allowed for admins
                        .requestMatchers("/v1/users/**").hasRole("ADMIN")

                        // all other requests, the user just needs to be authenticated, no role requirments
                        .anyRequest().authenticated())

                // get the CSRF token from the cookie and send it back in the header for all requests
                .csrf(csrf -> csrf
                        // write the token into a readable XSRF-TOKEN cookie
                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())

                        // tell spring security to look for the CSRF token in the XSRF-TOKEN cookie and send it back in the X-XSRF-TOKEN header
                        .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler()))

                // use basic auth for all requests
                .httpBasic(Customizer.withDefaults());

        return http.build();

    }

}
