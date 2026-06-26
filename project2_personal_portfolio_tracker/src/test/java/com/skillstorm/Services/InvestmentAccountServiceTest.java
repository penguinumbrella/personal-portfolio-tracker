package com.skillstorm.Services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.sql.Date;
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

import com.skillstorm.DTOs.InvestmentAccountDto;
import com.skillstorm.DTOs.UserDto;
import com.skillstorm.Models.Holding;
import com.skillstorm.Models.InvestmentAccount;
import com.skillstorm.Models.InvestmentType;
import com.skillstorm.Models.User;
import com.skillstorm.Repositories.InvestmentAccountRepo;
import com.skillstorm.Repositories.UserRepo;

@ExtendWith(MockitoExtension.class)
public class InvestmentAccountServiceTest {

    @Mock
    private UserRepo userRepo;

    @Mock
    private InvestmentAccountRepo investmentAccountRepo;

    @InjectMocks
    private InvestmentAccountService service;

    private User testUser1;
    private User testUser2;


    private InvestmentAccount testInvestmentAccount1;
    private InvestmentAccount testInvestmentAccount2;
    private InvestmentAccount testInvestmentAccount3;

    private InvestmentAccountDto testInvestmentAccountDto;

    @BeforeEach
    void dataInit() {
        testUser1 = new User(1, "test1", "test1@test.com", "test1");
        testUser2 = new User(2, "test2", "test2@test.com", "test2");

        //(int id, String nickname, InvestmentType accountType, String institutionName, Date dateOpened, User user)
        testInvestmentAccount1 = new InvestmentAccount(1, "test1", InvestmentType.BROKERAGE, "test1", Date.valueOf("2026-06-25"), testUser1);
        testInvestmentAccount2 = new InvestmentAccount(2, "test2", InvestmentType.ROTH_IRA, "test2", Date.valueOf("2026-06-26"), testUser2);
        //testInvestmentAccount3 = new InvestmentAccount(2, "test3", InvestmentType.K401, "test3", Date.valueOf("2026-06-26"), testUser1);
        testInvestmentAccountDto = new InvestmentAccountDto("test3", InvestmentType.K401, "test3", Date.valueOf("2026-06-27"), 1);
    }

    @Nested
    @DisplayName("getAccounts()")
    class getAccounts {

        @Test
        @DisplayName("returns all users")
        void returnAllAccounts() {
            when(investmentAccountRepo.findAll()).thenReturn(List.of(testInvestmentAccount1, testInvestmentAccount2));
            List<InvestmentAccount> results = service.getAccounts(null);
            assertEquals(2, results.size());
            verify(investmentAccountRepo).findAll();
            verify(investmentAccountRepo, never()).findByUserId(anyLong());
        }

        
        @Test
        @DisplayName("return accounts with user")
        void returnAccountsWithUser() {
            when(investmentAccountRepo.findByUserId(new Long(1))).thenReturn(List.of(testInvestmentAccount1));
            List<InvestmentAccount> results = service.getAccounts(new Long(1));
            assertEquals(1, results.size());
            verify(investmentAccountRepo).findByUserId(anyLong());
            verify(investmentAccountRepo, never()).findAll();
        }
            
    }

    @Nested
    @DisplayName("addAccounts()")
    class addAccounts {
        
        @Test
        @DisplayName("add account success")
        void addAccountSuccess() {
            when(userRepo.existsById(1)).thenReturn(true);
            when(investmentAccountRepo.existsByNickname(testInvestmentAccountDto.nickname())).thenReturn(false);
            when(userRepo.findById(1)).thenReturn(Optional.of(testUser1));

            when(investmentAccountRepo.save(any(InvestmentAccount.class))).thenAnswer(i -> i.getArgument(0));

            InvestmentAccount result = service.addAccount(1, testInvestmentAccountDto);

            //assertEquals(1, result.getId());
            assertEquals("test3", result.getNickname());
            assertEquals(InvestmentType.K401, result.getAccountType());
            assertEquals("test3", result.getInstitutionName());
            assertEquals(Date.valueOf("2026-06-27"), result.getDateOpened());
            assertEquals(testUser1, result.getUser());
        }
    }



    
}
