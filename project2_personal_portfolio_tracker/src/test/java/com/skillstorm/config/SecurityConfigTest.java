package com.skillstorm.config;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@DisplayName("SecurityConfig")
class SecurityConfigTest {

    private final SecurityConfig config = new SecurityConfig();

    @Nested
    @DisplayName("passwordEncoder()")
    class passwordEncoder {

        @Test
        @DisplayName("returns a BCryptPasswordEncoder that hashes and verifies passwords")
        void encodesAndMatchesPasswords() {
            PasswordEncoder encoder = config.passwordEncoder();

            assertInstanceOf(BCryptPasswordEncoder.class, encoder);

            String hash = encoder.encode("secret");

            assertTrue(encoder.matches("secret", hash));
            assertFalse(encoder.matches("wrong", hash));
        }
    }

    @Nested
    @DisplayName("authenticationManager()")
    class authenticationManager {

        @Test
        @DisplayName("authenticates a user with correct credentials")
        void authenticatesValidCredentials() {
            PasswordEncoder encoder = new BCryptPasswordEncoder();
            String hash = encoder.encode("secret");
            UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                    "bob", hash, List.of(new SimpleGrantedAuthority("ROLE_USER")));

            UserDetailsService userDetailsService = mock(UserDetailsService.class);
            when(userDetailsService.loadUserByUsername("bob")).thenReturn(userDetails);

            AuthenticationManager authenticationManager = config.authenticationManager(userDetailsService, encoder);

            Authentication result = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken("bob", "secret"));

            assertTrue(result.isAuthenticated());
        }

        @Test
        @DisplayName("rejects a user with incorrect credentials")
        void rejectsInvalidCredentials() {
            PasswordEncoder encoder = new BCryptPasswordEncoder();
            String hash = encoder.encode("secret");
            UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                    "bob", hash, List.of(new SimpleGrantedAuthority("ROLE_USER")));

            UserDetailsService userDetailsService = mock(UserDetailsService.class);
            when(userDetailsService.loadUserByUsername("bob")).thenReturn(userDetails);

            AuthenticationManager authenticationManager = config.authenticationManager(userDetailsService, encoder);

            assertThrows(BadCredentialsException.class, () -> authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken("bob", "wrong")));
        }
    }

    @Nested
    @DisplayName("securityContextRepository()")
    class securityContextRepository {

        @Test
        @DisplayName("returns an HttpSessionSecurityContextRepository")
        void returnsHttpSessionBackedRepository() {
            SecurityContextRepository repository = config.securityContextRepository();

            assertInstanceOf(HttpSessionSecurityContextRepository.class, repository);
        }
    }
}
