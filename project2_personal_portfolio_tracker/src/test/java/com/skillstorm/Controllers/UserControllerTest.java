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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.http.MediaType.APPLICATION_JSON;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
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
    private User testUserDiff;
    private UserDto testDtoSame;
    private UserDto testDtoDiff;

    @BeforeEach
    void dataInit() {
        testUser = new User(1, "plswork", "plswork@test.com", "hash");
        testDtoSame = new UserDto("plswork", "plswork@test.com", "hash");
        testDtoDiff = new UserDto("diff", "diff@test.com", "diff");
        testUserDiff = new User(1, "diff", "diff@test.com", "diff");
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
                .andExpect(jsonPath("$[0].passwordHash").doesNotExist());

        }
    }

    @Nested
    @DisplayName("POST /v1/users/{id}")
    class registerUser {

        @Test
        @DisplayName("201 OK user created")
        void registerUser() throws Exception{
            when(service.registerUser(testDtoSame)).thenReturn(testUser);

            mockMvc.perform(post("/v1/users")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testDtoSame)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("plswork"))
                .andExpect(jsonPath("$.email").value("plswork@test.com"))
                .andExpect(jsonPath("$.passwordHash").doesNotExist());
        }

    }

    @Nested
    @DisplayName("GET /v1/users/{id}")
    class viewProfile {

        @Test
        @DisplayName("200 OK user returned")
        void registerUser() throws Exception{
            when(service.viewProfile(1)).thenReturn(testUser);

            mockMvc.perform(get("/v1/users/" + 1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("plswork"))
                .andExpect(jsonPath("$.email").value("plswork@test.com"))
                .andExpect(jsonPath("$.passwordHash").doesNotExist());
        }

    }

    @Nested
    @DisplayName("PUT /v1/users/{id}")
    class updateUser {

        @Test
        @DisplayName("200 OK user updated")
        void updateProfile() throws Exception{
            when(service.updateProfile(1, testDtoDiff)).thenReturn(testUserDiff);

            mockMvc.perform(put("/v1/users/" + 1)
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testDtoDiff)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("diff"))
                .andExpect(jsonPath("$.email").value("diff@test.com"))
                .andExpect(jsonPath("$.passwordHash").doesNotExist());
        }

    }

    @Nested
    @DisplayName("DELETE /v1/users/{id}")
    class deleteProfile {

        @Test
        @DisplayName("204 OK user deleted")
        void deleteUser() throws Exception{
            when(service.deleteUser(1)).thenReturn(true);

            mockMvc.perform(delete("/v1/users/" + 1))
                .andExpect(status().isNoContent());

            verify(service).deleteUser(1);
        }

    }





}
