package com.skillstorm.Controllers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillstorm.DTOs.InvestmentAccountDto;
import com.skillstorm.DTOs.UserDto;
import com.skillstorm.Models.InvestmentAccount;
import com.skillstorm.Models.InvestmentType;
import com.skillstorm.Models.RoleType;
import com.skillstorm.Models.User;
import com.skillstorm.Services.InvestmentAccountService;
import com.skillstorm.Services.UserService;

import java.sql.Date;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.hamcrest.Matchers.hasSize;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import java.util.List;

@WebMvcTest(InvestmentAccountController.class)
@AutoConfigureMockMvc(addFilters = false)
public class InvestmentAccountControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private InvestmentAccountService service;

    private User testUser1;
    private User testUser2;

    private InvestmentAccount testAccount1;
    private InvestmentAccount testAccount2;

    private InvestmentAccountDto testAccountDto1;
    private InvestmentAccountDto testAccountDto2;

    @BeforeEach
    void dataInit() {
        testUser1 = new User(1, "test1", "test1@test.com", "test1", true, RoleType.USER);
        testUser2 = new User(2, "test2", "test2@test.com", "test2", true, RoleType.USER);

        Date date1 = Date.valueOf("2026-06-26");
        Date date2 = Date.valueOf("2026-06-27");

        InvestmentType investmentType1 = InvestmentType.BROKERAGE;
        InvestmentType investmentType2 = InvestmentType.ROTH_IRA;

        testAccount1 = new InvestmentAccount(1, "test1", investmentType1, "test1", date1, testUser1);
        testAccount2 = new InvestmentAccount(2, "test2", investmentType2, "test2", date2, testUser2);

        testAccountDto1 = new InvestmentAccountDto("test1", investmentType1, "test1", date1, testUser1.getId());
        testAccountDto2 = new InvestmentAccountDto("test2", investmentType2, "test2", date2, testUser2.getId());
    }

    @Nested
    @DisplayName("GET /v1/investments")
    class getAccounts {
        @Test
        @DisplayName("200 OK with a list of all investments")
        void getAllAccounts() throws Exception {
            when(service.getAccounts(null)).thenReturn(List.of(testAccount1, testAccount2));

            mockMvc.perform(get("/v1/investments"))
                    .andExpect((status().isOk()))

                    .andExpect(jsonPath("$", hasSize(2)))

                    .andExpect(jsonPath("$[0].nickname").value("test1"))
                    .andExpect(jsonPath("$[0].accountType").value("Brokerage"))
                    .andExpect(jsonPath("$[0].institutionName").value("test1"))
                    .andExpect(jsonPath("$[0].dateOpened").value("2026-06-26"))
                    .andExpect(jsonPath("$[0].user.id").value(testUser1.getId()))

                    .andExpect(jsonPath("$[1].nickname").value("test2"))
                    .andExpect(jsonPath("$[1].accountType").value("Roth IRA"))
                    .andExpect(jsonPath("$[1].institutionName").value("test2"))
                    .andExpect(jsonPath("$[1].dateOpened").value("2026-06-27"))
                    .andExpect(jsonPath("$[1].user.id").value(testUser2.getId()));

        }

        @Test
        @DisplayName("200 OK with a list of accounts for a given user id")
        void getAccountsForUserId() throws Exception {

            when(service.getAccounts(Long.valueOf(testUser1.getId()))).thenReturn(List.of(testAccount1));

            mockMvc.perform(get("/v1/investments?userId=" + testUser1.getId()))
                    .andExpect((status().isOk()))

                    .andExpect(jsonPath("$", hasSize(1)))

                    .andExpect(jsonPath("$[0].nickname").value("test1"))
                    .andExpect(jsonPath("$[0].accountType").value("Brokerage"))
                    .andExpect(jsonPath("$[0].institutionName").value("test1"))
                    .andExpect(jsonPath("$[0].dateOpened").value("2026-06-26"))
                    .andExpect(jsonPath("$[0].user.id").value(testUser1.getId()));
        }
    }

    @Nested
    @DisplayName("GET /v1/investments/{id}")
    class getAccount {
        @Test
        @DisplayName("200 OK with the account")
        void getAccountSuccess200() throws Exception {
            when(service.getAccount(1)).thenReturn(testAccount1);

            mockMvc.perform(get("/v1/investments/1"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.nickname").value("test1"));
        }
    }

    @Nested
    @DisplayName("GET /v1/investments/{id}/total-cost")
    class getAccountTotalCost {
        @Test
        @DisplayName("200 OK with the account's total cost")
        void getAccountTotalCostSuccess200() throws Exception {
            when(service.getAccountTotalCost(1)).thenReturn(250L);

            mockMvc.perform(get("/v1/investments/1/total-cost"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").value(250));
        }
    }

    @Nested
    @DisplayName("GET /v1/investments/total")
    class getUserInvestmentAccountTotal {
        @Test
        @DisplayName("200 OK with the user's investment account total")
        void getUserInvestmentAccountTotalSuccess200() throws Exception {
            when(service.getUserInvestmentAccountTotal(1)).thenReturn(2L);

            mockMvc.perform(get("/v1/investments/total").param("userId", "1"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").value(2));
        }
    }

    @Nested
    @DisplayName("GET /v1/investments/recent")
    class getRecentAccounts {
        @Test
        @DisplayName("200 OK with the user's most recent accounts")
        void getRecentAccountsSuccess200() throws Exception {
            when(service.getRecentAccounts(1L)).thenReturn(List.of(testAccount1));

            mockMvc.perform(get("/v1/investments/recent").param("userId", "1"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(1)))
                    .andExpect(jsonPath("$[0].nickname").value("test1"));
        }
    }

    @Nested
    @DisplayName("POST /v1/investments")
    class addAccount {
        @Test
        @DisplayName("201 OK investment created")
        void addAccount() throws Exception {
            String jsonDto = objectMapper.writeValueAsString(testAccountDto1);
            InvestmentAccountDto deserializedDto = objectMapper.readValue(jsonDto, InvestmentAccountDto.class);

            when(service.addAccount(deserializedDto)).thenReturn(testAccount1);
            mockMvc.perform(post("/v1/investments")
                    .contentType(APPLICATION_JSON)
                    .content(jsonDto))

                    .andExpect(status().isCreated())

                    .andExpect(jsonPath("$.nickname").value("test1"))
                    .andExpect(jsonPath("$.accountType").value("Brokerage"))
                    .andExpect(jsonPath("$.institutionName").value("test1"))
                    .andExpect(jsonPath("$.dateOpened").value("2026-06-26"))
                    .andExpect(jsonPath("$.user.id").value(testUser1.getId()));

        }
    }

    @Nested
    @DisplayName("PUT /v1/investments")
    class updateAccount {

        @Test
        @DisplayName("200 OK investment updated")
        void updateAccount() throws Exception {
            String jsonDto = objectMapper.writeValueAsString(testAccountDto1);
            InvestmentAccountDto deserializedDto = objectMapper.readValue(jsonDto, InvestmentAccountDto.class);

            when(service.updateAccount(testAccount1.getId(), deserializedDto)).thenReturn(testAccount1);

            mockMvc.perform(put("/v1/investments/" + testAccount1.getId())
                    .contentType(APPLICATION_JSON)
                    .content(jsonDto))

                    .andExpect(status().isOk())

                    .andExpect(jsonPath("$.nickname").value("test1"))
                    .andExpect(jsonPath("$.accountType").value("Brokerage"))
                    .andExpect(jsonPath("$.institutionName").value("test1"))
                    .andExpect(jsonPath("$.dateOpened").value("2026-06-26"))
                    .andExpect(jsonPath("$.user.id").value(testUser1.getId()));

        }
    }

    @Nested
    @DisplayName("DELETE /v1/investments/{id}")
    class deleteAccount {
        @Test
        @DisplayName("204 OK investment deleted")
        void deleteAccount() throws Exception {
            when(service.deleteAccount(testAccount1.getId())).thenReturn(true);
            mockMvc.perform(delete("/v1/investments/" + testAccount1.getId()))

                    .andExpect(status().isNoContent());

            verify(service).deleteAccount(testAccount1.getId());
        }
    }

}
