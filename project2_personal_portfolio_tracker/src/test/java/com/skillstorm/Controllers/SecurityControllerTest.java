package com.skillstorm.Controllers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillstorm.DTOs.SectorBreakdownDto;
import com.skillstorm.DTOs.SecurityDto;
import com.skillstorm.DTOs.SecurityTypeBreakdownDto;
import com.skillstorm.DTOs.TopSecurityDto;
import com.skillstorm.Models.RoleType;
import com.skillstorm.Models.SectorType;
import com.skillstorm.Models.Security;
import com.skillstorm.Models.SecurityType;
import com.skillstorm.Models.User;
import com.skillstorm.Services.SecurityService;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import java.util.List;

@WebMvcTest(SecurityController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("SecurityController - Web Layer Tests")
public class SecurityControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private SecurityService service;

    private Security testSecurity1;
    private Security testSecurity2;
    private SecurityDto testSDto1;
    private SecurityDto testSDto2;
    private User testUser1;
    private User testUser2;

    @BeforeEach
    void dataInit() {
        testUser1 = new User(1, "plswork", "plswork@test.com", "hash", true, RoleType.USER);
        testUser2 = new User(2, "diff", "diff@test.com", "diff", true, RoleType.USER);

        testSecurity1 = new Security(1, "abc", "Security One", SectorType.CONSUMER, SecurityType.BOND,
                "one", testUser1);
        testSecurity2 = new Security(2, "xyz", "Security Two", SectorType.ENERGY, SecurityType.ETF,
                "two", testUser2);

        testSDto1 = new SecurityDto(1, "abc", "Security One", SectorType.CONSUMER, SecurityType.BOND,
                "one", 1);
        testSDto2 = new SecurityDto(2, "xyz", "Security Two", SectorType.ENERGY, SecurityType.ETF,
                "two", 2);
    }

    // ----- POST/CREATE TESTS -----
    @Nested
    @DisplayName("POST /v1/securities")
    class addSecurity {

        @Test
        @DisplayName("201 CREATED - security created")
        void addSecuritySuccess201() throws Exception {
            when(service.addSecurity(any(SecurityDto.class))).thenReturn(testSecurity1);

            mockMvc.perform(post("/v1/securities")
                    .contentType(APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(testSDto1)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id").value(1))
                    .andExpect(jsonPath("$.tickerSymbol").value("abc"))
                    .andExpect(jsonPath("$.name").value("Security One"))
                    .andExpect(jsonPath("$.generalNotes").value("one"));
        }
    }

    // ----- GET/READ TESTS -----
    @Nested
    @DisplayName("GET /v1/securities")
    class getAllSecurities {

        @Test
        @DisplayName("200 all securities returned")
        void getAllSecuritiesSuccess200() throws Exception {
            when(service.getAllSecurities()).thenReturn(List.of(testSecurity1, testSecurity2));

            mockMvc.perform(get("/v1/securities"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$[0].tickerSymbol").value("abc"))
                    .andExpect(jsonPath("$[0].name").value("Security One"))
                    .andExpect(jsonPath("$[1].tickerSymbol").value("xyz"))
                    .andExpect(jsonPath("$[1].name").value("Security Two"));
        }
    }

    @Nested
    @DisplayName("GET /v1/securities/u/{userId}")
    class getAllSecuritiesPerUser {

        @Test
        @DisplayName("200 securities returned for user")
        void getAllSecuritiesPerUserSuccess200() throws Exception {
            when(service.getAllSecuritiesPerUser(1)).thenReturn(List.of(testSecurity1));

            mockMvc.perform(get("/v1/securities/u/1"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$[0].tickerSymbol").value("abc"))
                    .andExpect(jsonPath("$[0].name").value("Security One"));
        }
    }

    @Nested
    @DisplayName("GET /v1/securities/{id}")
    class getSecurity {

        @Test
        @DisplayName("200 OK - security returned")
        void getSecuritySuccess200() throws Exception {
            when(service.getSecurity(1)).thenReturn(testSecurity1);

            mockMvc.perform(get("/v1/securities/1"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(1))
                    .andExpect(jsonPath("$.tickerSymbol").value("abc"))
                    .andExpect(jsonPath("$.name").value("Security One"));
        }

        @Test
        @DisplayName("404 NOT FOUND - security not found")
        void getSecurityNotFound404() throws Exception {
            when(service.getSecurity(1))
                    .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Security not found"));

            mockMvc.perform(get("/v1/securities/1"))
                    .andExpect(status().isNotFound());
        }
    }

    // ----- PUT/UPDATE TESTS -----
    @Nested
    @DisplayName("PUT /v1/securities/{id}")
    class updateSecurity {

        @Test
        @DisplayName("200 OK - security updated")
        void updateSecuritySuccess200() throws Exception {
            when(service.updateSecurity(anyInt(), any(SecurityDto.class))).thenReturn(testSecurity1);

            mockMvc.perform(put("/v1/securities/1")
                    .contentType(APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(testSDto1)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(1))
                    .andExpect(jsonPath("$.tickerSymbol").value("abc"))
                    .andExpect(jsonPath("$.name").value("Security One"));
        }

        @Test
        @DisplayName("404 security not found")
        void updateSecurityNotFound404() throws Exception {
            when(service.updateSecurity(anyInt(), any(SecurityDto.class)))
                    .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Security not found"));

            mockMvc.perform(put("/v1/securities/2")
                    .contentType(APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(testSDto2)))
                    .andExpect(status().isNotFound());
        }
    }

    // ---- DELETE TESTS -----
    @Nested
    @DisplayName("DELETE /v1/securities/{id}")
    class deleteSecurity {

        @Test
        @DisplayName("204 NO CONTENT security deleted")
        void deleteSecuritySuccess204() throws Exception {
            when(service.deleteSecurity(1)).thenReturn(true);

            mockMvc.perform(delete("/v1/securities/1"))
                    .andExpect(status().isNoContent());
        }

        @Test
        @DisplayName("404 NOT FOUND security not found")
        void deleteSecurityNotFound404() throws Exception {
            when(service.deleteSecurity(1))
                    .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Security not found"));

            mockMvc.perform(delete("/v1/securities/1"))
                    .andExpect(status().isNotFound());
        }
    }

    @Nested
    @DisplayName("GET /v1/securities/total")
    class getUserSecurityAccountTotal {

        @Test
        @DisplayName("200 OK total returned")
        void getUserSecurityAccountTotalSuccess200() throws Exception {
            when(service.getUserSecurityAccountTotal(1)).thenReturn(5L);

            mockMvc.perform(get("/v1/securities/total").param("userId", "1"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").value(5));
        }
    }

    @Nested
    @DisplayName("GET /v1/securities/top")
    class getTopSecurities {

        @Test
        @DisplayName("200 OK top securities returned")
        void getTopSecuritiesSuccess200() throws Exception {
            TopSecurityDto top = new TopSecurityDto(1, "Security One", 500L);
            when(service.getTop5SecurityValues(1)).thenReturn(List.of(top));

            mockMvc.perform(get("/v1/securities/top").param("userId", "1"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$[0].name").value("Security One"));
        }
    }

    @Nested
    @DisplayName("GET /v1/securities/breakdown/type")
    class getSecurityTypeBreakdown {

        @Test
        @DisplayName("200 OK breakdown returned")
        void getSecurityTypeBreakdownSuccess200() throws Exception {
            SecurityTypeBreakdownDto breakdown = new SecurityTypeBreakdownDto(SecurityType.BOND, 2L);
            when(service.getSecurityTypeBreakdown(1)).thenReturn(List.of(breakdown));

            mockMvc.perform(get("/v1/securities/breakdown/type").param("userId", "1"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$[0].type").value("Bond"))
                    .andExpect(jsonPath("$[0].count").value(2));
        }
    }

    @Nested
    @DisplayName("GET /v1/securities/breakdown/sector")
    class getSectorBreakdown {

        @Test
        @DisplayName("200 OK breakdown returned")
        void getSectorBreakdownSuccess200() throws Exception {
            SectorBreakdownDto breakdown = new SectorBreakdownDto(SectorType.CONSUMER, 2L);
            when(service.getSectorBreakdown(1)).thenReturn(List.of(breakdown));

            mockMvc.perform(get("/v1/securities/breakdown/sector").param("userId", "1"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$[0].sector").value("Consumer"))
                    .andExpect(jsonPath("$[0].count").value(2));
        }
    }
}
