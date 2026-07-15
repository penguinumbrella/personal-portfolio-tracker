package com.skillstorm.Services;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import com.skillstorm.DTOs.UserDto;
import com.skillstorm.Models.RoleType;
import com.skillstorm.Models.User;
import com.skillstorm.Repositories.UserRepo;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepo repo;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService service;

    private User testUser;
    private UserDto testDto;

    @BeforeEach
    void dataInit() {
        testUser = new User(1, "plswork", "plswork@test.com", "hash", true, RoleType.USER);
        testDto = new UserDto("testuser", "test@test.com", "hash");
    }

    @Nested
    @DisplayName("getAll()")
    class getAllUsers {

        @Test
        @DisplayName("returns all users")
        void returnAllUsers() {
            when(repo.findAll()).thenReturn(List.of(testUser));
            List<User> results = service.getAll();
            assertEquals(1, results.size());
            verify(repo).findAll();
        }
    }

    @Nested
    @DisplayName("registerUser()")
    class registerUser {

        @Test
        @DisplayName("successfully register a user")
        void registerNewUser() {
            when(repo.existsByUsername(anyString())).thenReturn(false);
            when(passwordEncoder.encode(anyString())).thenReturn("hash");
            when(repo.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

            User result = service.registerUser(testDto);

            assertEquals("testuser", result.getUsername());
            assertEquals("test@test.com", result.getEmail());
            assertEquals("hash", result.getPasswordHash());

            verify(repo).save(any(User.class));

        }

        @Test
        @DisplayName("throw exception when username is taken")
        void throwExceptionWhenUsernameTaken() {
            when(repo.existsByUsername(anyString())).thenReturn(true);
            ResponseStatusException result = assertThrows(ResponseStatusException.class,
                    () -> service.registerUser(testDto));

            assertEquals(HttpStatus.CONFLICT, result.getStatusCode());
            assertEquals("Username taken. Please use another username.", result.getReason());
            verify(repo, never()).save(any(User.class));
        }
    }

    @Nested
    @DisplayName("viewProfile()")
    class viewProfile {
        @Test
        @DisplayName("return User when they exist")
        void returnUserWhenExists() {
            when(repo.findById(1)).thenReturn(Optional.of(testUser));
            assertEquals(testUser, service.viewProfile(1));
            verify(repo).findById(1);
        }

        @Test
        @DisplayName("thrown exception when user doesn't exist")
        void throwExceptionWhenUserDoesntExist() {
            when(repo.findById(99)).thenReturn(Optional.empty());

            ResponseStatusException result = assertThrows(ResponseStatusException.class, () -> service.viewProfile(99));

            assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
            assertEquals("User with id 99 does not exist in the database.", result.getReason());
            verify(repo).findById(99);

        }

    }

    @Nested
    @DisplayName("viewProfileByUsername()")
    class viewProfileByUsername {
        @Test
        @DisplayName("return User when they exist")
        void returnUserWhenExists() {
            when(repo.findByUsername("plswork")).thenReturn(Optional.of(testUser));
            assertEquals(testUser, service.viewProfileByUsername("plswork"));
            verify(repo).findByUsername("plswork");
        }

        @Test
        @DisplayName("throws when no user is found with the given username")
        void throwExceptionWhenUserDoesntExist() {
            when(repo.findByUsername("nobody")).thenReturn(Optional.empty());

            assertThrows(UsernameNotFoundException.class, () -> service.viewProfileByUsername("nobody"));
        }
    }

    @Nested
    @DisplayName("editUser()")
    class updateProfile {
        @Test
        @DisplayName("updated user successfully")
        void updateSuccessful() {
            when(repo.findById(1)).thenReturn(Optional.of(testUser));
            when(passwordEncoder.encode(anyString())).thenReturn("hash");
            when(repo.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

            User result = service.updateProfile(1, testDto);

            assertEquals("testuser", result.getUsername());
            assertEquals("test@test.com", result.getEmail());
            assertEquals("hash", result.getPasswordHash());

            verify(repo).save(any(User.class));
        }

        @Test
        @DisplayName("throw exception when username is taken")
        void throwExceptionWhenUsernameTaken() {
            when(repo.findById(1)).thenReturn(Optional.of(testUser));
            when(repo.existsByUsername(anyString())).thenReturn(true);
            ResponseStatusException result = assertThrows(ResponseStatusException.class,
                    () -> service.updateProfile(1, testDto));

            assertEquals(HttpStatus.CONFLICT, result.getStatusCode());
            assertEquals("Username taken. Please use another username.", result.getReason());
            verify(repo, never()).save(any(User.class));
        }

        @Test
        @DisplayName("update success when username unchanged")
        void updateSuccessfulWhenUsernameChanged() {

            User existingUser = new User(1, "testuser", "oldtest@test.com", "hash", true, RoleType.USER);

            when(repo.findById(1)).thenReturn(Optional.of(existingUser));
            when(passwordEncoder.encode(anyString())).thenReturn("hash");
            when(repo.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

            User result = service.updateProfile(1, testDto);

            assertEquals("testuser", result.getUsername());
            assertEquals("test@test.com", result.getEmail());
            assertEquals("hash", result.getPasswordHash());

            verify(repo).save(any(User.class));
            verify(repo, never()).existsByUsername(anyString());
        }

        @Test
        @DisplayName("user id doesn't exist")
        void throwExceptionWhenNoSuchUserIdExists() {
            when(repo.findById(99)).thenReturn(Optional.empty());

            ResponseStatusException result = assertThrows(ResponseStatusException.class,
                    () -> service.updateProfile(99, testDto));

            assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
            assertEquals("User with id 99 does not exist in the database.", result.getReason());

            verify(repo, never()).save(any(User.class));
        }
    }

    @Nested
    @DisplayName("deleteUser()")
    class deleteUser {
        @Test
        @DisplayName("successfully delete a user")
        void deleteUserSuccess() {
            when(repo.findById(1)).thenReturn(Optional.of(testUser));
            when(repo.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

            boolean result = service.deleteUser(1);

            assertTrue(result);
            assertFalse(testUser.isEnabled());
            verify(repo).save(testUser);
        }

        @Test
        @DisplayName("deletion: no user found")
        void deleteUserFailNotFound() {
            when(repo.findById(99)).thenReturn(Optional.empty());

            ResponseStatusException result = assertThrows(ResponseStatusException.class, () -> service.deleteUser(99));

            assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
            assertEquals("User with id 99 does not exist in the database.", result.getReason());
            verify(repo, never()).deleteById(anyInt());
        }
    }

    @Nested
    @DisplayName("loadUserByUsername()")
    class loadUserByUsername {

        @Test
        @DisplayName("returns UserDetails when the user exists")
        void loadUserByUsernameSuccess() {
            when(repo.findByUsername("plswork")).thenReturn(Optional.of(testUser));

            UserDetails result = service.loadUserByUsername("plswork");

            assertEquals("plswork", result.getUsername());
            assertEquals("hash", result.getPassword());
            assertTrue(result.isEnabled());
            assertTrue(result.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_USER")));
        }

        @Test
        @DisplayName("throws when no user is found with the given username")
        void loadUserByUsernameNotFound() {
            when(repo.findByUsername("nobody")).thenReturn(Optional.empty());

            assertThrows(UsernameNotFoundException.class, () -> service.loadUserByUsername("nobody"));
        }
    }

}
