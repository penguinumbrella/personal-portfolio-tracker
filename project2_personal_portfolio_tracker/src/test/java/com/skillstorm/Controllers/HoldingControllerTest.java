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

        // User with an account and security
        testUser1 = new User(1, "plswork", "plswork@test.com", "hash");
        testAccount1 = new InvestmentAccount(1, "account One", InvestmentType.BROKERAGE, "test1",
                Date.valueOf("2026-06-25"), testUser1);
        testSecurity1 = new Security(1, "abc", "Security One", SectorType.CONSUMER, SecurityType.BOND,
                "one", testUser1);

        // Different User + account + security
        testUser2 = new User(2, "diff", "diff@test.com", "diff");
        testAccount2 = new InvestmentAccount(2, "Account Two", InvestmentType.HSA, "test2", Date.valueOf("2035-06-25"),
                testUser2);
        testSecurity2 = new Security(2, "xyz", "Security Two", SectorType.ENERGY, SecurityType.ETF,
                "two", testUser2);

    }

    @Nested
    @DisplayName("POST /v1/holdings")
    class addHolding {

        @Test
        @DisplayName("201 OK holding created")
        void addHolding() throws Exception {
            when(service.addHolding(any(HoldingDto.class))).thenReturn(testHolding1);

            mockMvc.perform(post("/v1/holdings")
                    .contentType(APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(testHDto1)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.shares").value(9))
                    .andExpect(jsonPath("$.costPerShare").value(99))
                    .andExpect(jsonPath("$.purchaseDate").value("2067-01-01"))
                    .andExpect(jsonPath("$.account.id").value(1))
                    .andExpect(jsonPath("$.security.id").value(1));
        }
    }

    @Test
    void getAllHoldings_Returns200() throws Exception {
        when(service.getAllHoldings()).thenReturn(List.of(testHolding1));

        mockMvc.perform(get("/v1/holdings"))
                .andExpect(status().isOk());
    }

    @Test
    void getHolding_Returns200() throws Exception {
        when(service.getHolding(1, 2)).thenReturn(testHolding1);

        mockMvc.perform(get("/v1/holdings/a/1/s/2"))
                .andExpect(status().isOk());
    }

    @Test
    void getHolding_NotFound_Returns404() throws Exception {
        when(service.getHolding(1, 2))
                .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND));

        mockMvc.perform(get("/v1/holdings/a/1/s/2"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteHolding_Returns204() throws Exception {
        when(service.deleteHolding(1, 2)).thenReturn(true);

        mockMvc.perform(delete("/v1/holdings/a/1/s/2"))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteHolding_NotFound_Returns404() throws Exception {
        when(service.deleteHolding(1, 2))
                .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND));

        mockMvc.perform(delete("/v1/holdings/a/1/s/2"))
                .andExpect(status().isNotFound());
    }
}