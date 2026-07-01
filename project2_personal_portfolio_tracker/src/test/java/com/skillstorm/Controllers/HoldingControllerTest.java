package com.skillstorm.Controllers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillstorm.DTOs.HoldingDto;
import com.skillstorm.Models.Holding;
import com.skillstorm.Models.HoldingPK;
import com.skillstorm.Models.InvestmentAccount;
import com.skillstorm.Models.InvestmentType;
import com.skillstorm.Models.SectorType;
import com.skillstorm.Models.Security;
import com.skillstorm.Models.SecurityType;
import com.skillstorm.Models.User;
import com.skillstorm.Services.HoldingService;

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

import java.sql.Date;
import java.util.List;

@WebMvcTest(HoldingController.class)
@DisplayName("HoldingController - Web Layer Tests")
class HoldingControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @MockitoBean
        private HoldingService service;

        private Holding testHolding1;
        private Holding testHolding2;
        private HoldingDto testHDto1;
        private HoldingDto testHDto2;

        private HoldingPK testPk1;
        private HoldingPK testPk2;

        private User testUser1;
        private User testUser2;

        private Security testSecurity1;
        private Security testSecurity2;

        private InvestmentAccount testAccount1;
        private InvestmentAccount testAccount2;

        @BeforeEach
        void dataInit() {
                // User with an account and security
                testUser1 = new User(1, "plswork", "plswork@test.com", "hash");
                testAccount1 = new InvestmentAccount(1, "account One", InvestmentType.BROKERAGE, "test1",
                                Date.valueOf("2026-06-25"), testUser1);
                testSecurity1 = new Security(1, "abc", "Security One", SectorType.CONSUMER, SecurityType.BOND,
                                "one", testUser1);

                // Different User + account + security
                testUser2 = new User(2, "diff", "diff@test.com", "diff");
                testAccount2 = new InvestmentAccount(2, "Account Two", InvestmentType.HSA, "test2",
                                Date.valueOf("2035-06-25"), testUser2);
                testSecurity2 = new Security(2, "xyz", "Security Two", SectorType.ENERGY, SecurityType.ETF,
                                "two", testUser2);

                // Test Holding obj with equiv DTO
                testPk1 = new HoldingPK(1, 1);
                testHolding1 = new Holding(testPk1, 9, 99, Date.valueOf("2067-01-01"),
                                testAccount1, testSecurity1);
                testHDto1 = new HoldingDto(1, 1, 9, 99, Date.valueOf("2067-01-01"));

                // Other Holding obj with equiv DTO
                testPk2 = new HoldingPK(2, 2);
                testHolding2 = new Holding(testPk2, 55, 55, Date.valueOf("2009-12-12"),
                                testAccount2, testSecurity2);
                testHDto2 = new HoldingDto(2, 2, 55, 55, Date.valueOf("2009-12-12"));

        }

        // ----- POST/CREATE TESTS -----
        @Nested
        @DisplayName("POST /v1/holdings")
        class addHolding {

                @Test
                @DisplayName("201 OK holding created")
                void addHoldingSuccess201() throws Exception {
                        when(service.addHolding(any(HoldingDto.class))).thenReturn(testHolding1);

                        mockMvc.perform(post("/v1/holdings")
                                        .contentType(APPLICATION_JSON)
                                        .content(objectMapper.writeValueAsString(testHDto1)))
                                        .andExpect(status().isCreated())
                                        .andExpect(jsonPath("$.id.accountId").value(1))
                                        .andExpect(jsonPath("$.id.securityId").value(1))
                                        .andExpect(jsonPath("$.shares").value(9))
                                        .andExpect(jsonPath("$.costPerShare").value(99))
                                        .andExpect(jsonPath("$.purchaseDate").value("2067-01-01"));
                }
        }

        // ----- GET/READ TESTS -----
        @Nested
        @DisplayName("GET /v1/holdings")
        class getAllHoldings {

                @Test
                @DisplayName("200 OK all holdings returned")
                void getAllHoldingsSuccess200() throws Exception {
                        when(service.getAllHoldings()).thenReturn(List.of(testHolding1, testHolding2));

                        mockMvc.perform(get("/v1/holdings"))
                                        .andExpect(status().isOk())
                                        .andExpect(jsonPath("$[0].id.accountId").value(1))
                                        .andExpect(jsonPath("$[0].id.securityId").value(1))
                                        .andExpect(jsonPath("$[0].shares").value(9))
                                        .andExpect(jsonPath("$[0].costPerShare").value(99))
                                        .andExpect(jsonPath("$[1].id.accountId").value(2))
                                        .andExpect(jsonPath("$[1].id.securityId").value(2))
                                        .andExpect(jsonPath("$[1].shares").value(55))
                                        .andExpect(jsonPath("$[1].costPerShare").value(55));
                }
        }

        @Nested
        @DisplayName("GET /v1/holdings/a/{accountId}")
        class getAllHoldingsPerAccount {

                @Test
                @DisplayName("200 OK holdings returned for account")
                void getAllHoldingsPerAccountSuccess200() throws Exception {
                        when(service.getAllHoldingsPerAccount(1)).thenReturn(List.of(testHolding1));

                        mockMvc.perform(get("/v1/holdings/a/1"))
                                        .andExpect(status().isOk())
                                        .andExpect(jsonPath("$[0].shares").value(9))
                                        .andExpect(jsonPath("$[0].costPerShare").value(99));
                }

                @Test
                @DisplayName("200 OK empty list when no holdings for account")
                void getAllHoldingsPerAccountEmpty200() throws Exception {
                        when(service.getAllHoldingsPerAccount(1)).thenReturn(List.of());

                        mockMvc.perform(get("/v1/holdings/a/1"))
                                        .andExpect(status().isOk())
                                        .andExpect(jsonPath("$").isEmpty());
                }
        }

        @Nested
        @DisplayName("GET /v1/holdings/s/{securityId}")
        class getAllHoldingsPerSecurity {

                @Test
                @DisplayName("200 OK holdings returned for security")
                void getAllHoldingsPerSecuritySuccess200() throws Exception {
                        when(service.getAllHoldingsPerSecurity(1)).thenReturn(List.of(testHolding1));

                        mockMvc.perform(get("/v1/holdings/s/1"))
                                        .andExpect(status().isOk())
                                        .andExpect(jsonPath("$[0].shares").value(9))
                                        .andExpect(jsonPath("$[0].costPerShare").value(99));
                }

                @Test
                @DisplayName("200 empty list when no holdings for security")
                void getAllHoldingsPerSecurityEmpty200() throws Exception {
                        when(service.getAllHoldingsPerSecurity(1)).thenReturn(List.of());

                        mockMvc.perform(get("/v1/holdings/s/1"))
                                        .andExpect(status().isOk())
                                        .andExpect(jsonPath("$").isEmpty());
                }
        }

        @Nested
        @DisplayName("GET /v1/holdings/a/{accountId}/s/{securityId}")
        class getHolding {

                @Test
                @DisplayName("200 OK holding returned")
                void getHoldingSuccess200() throws Exception {
                        when(service.getHolding(1, 1)).thenReturn(testHolding1);

                        mockMvc.perform(get("/v1/holdings/a/1/s/1"))
                                        .andExpect(status().isOk())
                                        .andExpect(jsonPath("$.id.accountId").value(1))
                                        .andExpect(jsonPath("$.id.securityId").value(1))
                                        .andExpect(jsonPath("$.shares").value(9))
                                        .andExpect(jsonPath("$.costPerShare").value(99))
                                        .andExpect(jsonPath("$.purchaseDate").value("2067-01-01"));
                }

                @Test
                @DisplayName("404 NOT FOUND holding not found")
                void getHoldingNotFound404() throws Exception {
                        when(service.getHolding(1, 1))
                                        .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                        "Holding not found"));

                        mockMvc.perform(get("/v1/holdings/a/1/s/1"))
                                        .andExpect(status().isNotFound());
                }
        }

        // ----- PUT/UPDATE TESTS -----
        @Nested
        @DisplayName("PUT /v1/holdings/a/{accountId}/s/{securityId}")
        class updateHolding {

                @Test
                @DisplayName("201 OK holding updated")
                void updateHoldingSuccess201() throws Exception {
                        when(service.updateHolding(anyInt(), anyInt(), any(HoldingDto.class))).thenReturn(testHolding2);

                        mockMvc.perform(put("/v1/holdings/a/1/s/1")
                                        .contentType(APPLICATION_JSON)
                                        .content(objectMapper.writeValueAsString(testHDto2)))
                                        .andExpect(status().isCreated())
                                        .andExpect(jsonPath("$.id.accountId").value(2))
                                        .andExpect(jsonPath("$.id.securityId").value(2))
                                        .andExpect(jsonPath("$.shares").value(55))
                                        .andExpect(jsonPath("$.costPerShare").value(55))
                                        .andExpect(jsonPath("$.purchaseDate").value("2009-12-12"));
                }

                @Test
                @DisplayName("404 NOT FOUND holding not found")
                void updateHoldingNotFound404() throws Exception {
                        when(service.updateHolding(anyInt(), anyInt(), any(HoldingDto.class)))
                                        .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                        "Holding not found"));

                        mockMvc.perform(put("/v1/holdings/a/1/s/1")
                                        .contentType(APPLICATION_JSON)
                                        .content(objectMapper.writeValueAsString(testHDto1)))
                                        .andExpect(status().isNotFound());
                }
        }

        // ---- DELETE TESTS -----
        @Nested
        @DisplayName("DELETE /v1/holdings/a/{accountId}/s/{securityId}")
        class deleteHolding {

                @Test
                @DisplayName("204 NO CONTENT holding deleted")
                void deleteHoldingSuccess204() throws Exception {
                        when(service.deleteHolding(1, 1)).thenReturn(true);

                        mockMvc.perform(delete("/v1/holdings/a/1/s/1"))
                                        .andExpect(status().isNoContent());
                }

                @Test
                @DisplayName("404 NOT FOUND holding not found")
                void deleteHoldingNotFound404() throws Exception {
                        when(service.deleteHolding(9, 9))
                                        .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                        "Holding not found"));

                        mockMvc.perform(delete("/v1/holdings/a/9/s/9"))
                                        .andExpect(status().isNotFound());
                }
        }
}