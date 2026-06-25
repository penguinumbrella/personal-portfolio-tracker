package com.skillstorm.Controllers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillstorm.DTOs.UserDto;
import com.skillstorm.Models.User;
import com.skillstorm.Services.UserService;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import java.util.List;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean 
    private UserService service;

    private User testUser;
    private UserDto testDto;

    @BeforeEach
    void dataInit() {
        testUser = new User(1, "plswork", "plswork@test.com", "hash");
        testDto = new UserDto("testuser", "test@test.com", "hash");
    }

    @Nested
    @DisplayName("GET /v1/users")
    class getAllUsers {
        @Test
        @DisplayName("200 OK with a list of all users")
        void getAll() throws Exception {
            when(service.getAll()).thenReturn(List.of(testUser));

            mockMvc.perform(get("/v1/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username").value("plswork"))
                .andExpect(jsonPath("$[0].email").value("plswork@test.com"))
                .andExpect(jsonPath("$[0].passwordHash").value("hash"));

        }
    }

    @Nested
    @DisplayName("GET /v1/users/{id}")
    class viewProfile {

    }


}
