package com.skillstorm.Services;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.never;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;



import com.skillstorm.Models.User;
import com.skillstorm.Repositories.UserRepo;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepo repo;

    @InjectMocks
    private UserService service;

    private User testUser;

    @BeforeEach
    void dataInit() {
        testUser = new User(1, "plsworkplspls", "plswork@gmail.com", "bruh");
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
            
        }
    }







    
}
