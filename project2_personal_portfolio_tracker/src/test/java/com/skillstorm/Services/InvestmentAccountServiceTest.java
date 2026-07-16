package com.skillstorm.Services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

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
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.skillstorm.DTOs.AccountTypeBreakdownDto;
import com.skillstorm.DTOs.InvestmentAccountDto;
import com.skillstorm.DTOs.UserDto;
import com.skillstorm.Models.Holding;
import com.skillstorm.Models.InvestmentAccount;
import com.skillstorm.Models.InvestmentType;
import com.skillstorm.Models.RoleType;
import com.skillstorm.Models.User;
import com.skillstorm.Repositories.HoldingRepo;
import com.skillstorm.Repositories.InvestmentAccountRepo;
import com.skillstorm.Repositories.UserRepo;

@ExtendWith(MockitoExtension.class)
public class InvestmentAccountServiceTest {

    @Mock
    private UserRepo userRepo;

    @Mock
    private InvestmentAccountRepo investmentAccountRepo;

    @Mock
    private HoldingRepo holdingRepo;

    @InjectMocks
    private InvestmentAccountService service;

    private User testUser1;
    private User testUser2;

    private InvestmentAccount testInvestmentAccount1;
    private InvestmentAccount testInvestmentAccount2;
    //private InvestmentAccount testInvestmentAccount3;

    private InvestmentAccountDto testInvestmentAccountDto1;
    private InvestmentAccountDto testInvestmentAccountDto2;
    private InvestmentAccountDto testInvestmentAccountDto3;

    @BeforeEach
    void dataInit() {
        testUser1 = new User(1, "test1", "test1@test.com", "test1", true, RoleType.USER);
        testUser2 = new User(2, "test2", "test2@test.com", "test2", true, RoleType.USER);

        //(int id, String nickname, InvestmentType accountType, String institutionName, Date dateOpened, User user)
        testInvestmentAccount1 = new InvestmentAccount(1, "test1", InvestmentType.BROKERAGE, "test1",
                Date.valueOf("2026-06-25"), testUser1);
        testInvestmentAccount2 = new InvestmentAccount(2, "test2", InvestmentType.ROTH_IRA, "test2",
                Date.valueOf("2026-06-26"), testUser2);
        //testInvestmentAccount3 = new InvestmentAccount(2, "test3", InvestmentType.K401, "test3", Date.valueOf("2026-06-26"), testUser1);
        testInvestmentAccountDto1 = new InvestmentAccountDto(testInvestmentAccount1.getNickname(),
                testInvestmentAccount1.getAccountType(), testInvestmentAccount1.getInstitutionName(),
                testInvestmentAccount1.getDateOpened(), testUser1.getId());
        testInvestmentAccountDto2 = new InvestmentAccountDto(testInvestmentAccount2.getNickname(),
                testInvestmentAccount2.getAccountType(), testInvestmentAccount2.getInstitutionName(),
                testInvestmentAccount2.getDateOpened(), testUser2.getId());
        testInvestmentAccountDto3 = new InvestmentAccountDto(testInvestmentAccount2.getNickname(),
                testInvestmentAccount2.getAccountType(), testInvestmentAccount2.getInstitutionName(),
                testInvestmentAccount2.getDateOpened(), testUser1.getId());
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
            when(investmentAccountRepo.findByUserId(new Long(testUser1.getId())))
                    .thenReturn(List.of(testInvestmentAccount1));
            List<InvestmentAccount> results = service.getAccounts(new Long(testUser1.getId()));
            assertEquals(1, results.size());
            verify(investmentAccountRepo).findByUserId(anyLong());
            verify(investmentAccountRepo, never()).findAll();
        }

    }

    @Nested
    @DisplayName("getAccount()")
    class getAccount {

        @Test
        @DisplayName("returns the account when it exists")
        void getAccountSuccess() {
            when(investmentAccountRepo.findById(1)).thenReturn(Optional.of(testInvestmentAccount1));

            InvestmentAccount result = service.getAccount(1);

            assertEquals(testInvestmentAccount1, result);
            verify(investmentAccountRepo).findById(1);
        }

        @Test
        @DisplayName("throws when the account doesn't exist")
        void getAccountNotFound() {
            when(investmentAccountRepo.findById(99)).thenReturn(Optional.empty());

            ResponseStatusException result = assertThrows(ResponseStatusException.class,
                    () -> service.getAccount(99));

            assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
        }
    }

    @Nested
    @DisplayName("getAccountTotalCost()")
    class getAccountTotalCost {

        @Test
        @DisplayName("returns the account's total cost")
        void getAccountTotalCostSuccess() {
            when(holdingRepo.sumCostByAccountId(1)).thenReturn(250L);

            Long result = service.getAccountTotalCost(1);

            assertEquals(250L, result);
            verify(holdingRepo).sumCostByAccountId(1);
        }
    }

    @Nested
    @DisplayName("getUserInvestmentAccountTotal()")
    class getUserInvestmentAccountTotal {

        @Test
        @DisplayName("returns the total for the user")
        void getUserInvestmentAccountTotalSuccess() {
            when(userRepo.findById(1)).thenReturn(Optional.of(testUser1));
            when(investmentAccountRepo.countByUser(testUser1)).thenReturn(2L);

            Long result = service.getUserInvestmentAccountTotal(1);

            assertEquals(2L, result);
            verify(investmentAccountRepo).countByUser(testUser1);
        }

        @Test
        @DisplayName("throws when the user doesn't exist")
        void getUserInvestmentAccountTotalUserNotFound() {
            when(userRepo.findById(99)).thenReturn(Optional.empty());

            ResponseStatusException result = assertThrows(ResponseStatusException.class,
                    () -> service.getUserInvestmentAccountTotal(99));

            assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
            verify(investmentAccountRepo, never()).countByUser(any());
        }
    }

    @Nested
    @DisplayName("getRecentAccounts()")
    class getRecentAccounts {

        @Test
        @DisplayName("returns the user's most recent accounts")
        void getRecentAccountsSuccess() {
            when(investmentAccountRepo.findTop5ByUserIdOrderByDateOpenedDesc(1L))
                    .thenReturn(List.of(testInvestmentAccount1));

            List<InvestmentAccount> result = service.getRecentAccounts(1L);

            assertEquals(1, result.size());
            verify(investmentAccountRepo).findTop5ByUserIdOrderByDateOpenedDesc(1L);
        }
    }

    @Nested
    @DisplayName("getAccountTypeBreakdown()")
    class getAccountTypeBreakdown {

        @Test
        @DisplayName("returns the breakdown for the user")
        void getAccountTypeBreakdownSuccess() {
            AccountTypeBreakdownDto breakdown = new AccountTypeBreakdownDto(InvestmentType.BROKERAGE, 2L);
            when(userRepo.findById(1)).thenReturn(Optional.of(testUser1));
            when(investmentAccountRepo.countByAccountTypeForUser(1)).thenReturn(List.of(breakdown));

            Iterable<AccountTypeBreakdownDto> result = service.getAccountTypeBreakdown(1);

            assertEquals(1, ((List<AccountTypeBreakdownDto>) result).size());
            verify(investmentAccountRepo).countByAccountTypeForUser(1);
        }

        @Test
        @DisplayName("throws when the user doesn't exist")
        void getAccountTypeBreakdownUserNotFound() {
            when(userRepo.findById(99)).thenReturn(Optional.empty());

            ResponseStatusException result = assertThrows(ResponseStatusException.class,
                    () -> service.getAccountTypeBreakdown(99));

            assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
            verify(investmentAccountRepo, never()).countByAccountTypeForUser(anyInt());
        }
    }

    @Nested
    @DisplayName("addAccount()")
    class addAccount {

        @Test
        @DisplayName("add account success")
        void addAccountSuccess() {
            //when(userRepo.existsById(1)).thenReturn(true);
            when(investmentAccountRepo.existsByNickname(testInvestmentAccountDto1.nickname())).thenReturn(false);
            when(userRepo.findById(testInvestmentAccountDto1.userId())).thenReturn(Optional.of(testUser1));

            when(investmentAccountRepo.save(any(InvestmentAccount.class))).thenAnswer(i -> i.getArgument(0));

            InvestmentAccount result = service.addAccount(testInvestmentAccountDto1);

            //assertEquals(1, result.getId());
            assertEquals(testInvestmentAccount1.getNickname(), result.getNickname());
            assertEquals(testInvestmentAccount1.getAccountType(), result.getAccountType());
            assertEquals(testInvestmentAccount1.getInstitutionName(), result.getInstitutionName());
            assertEquals(testInvestmentAccount1.getDateOpened(), result.getDateOpened());
            assertEquals(testUser1, result.getUser());

            verify(investmentAccountRepo).save(any(InvestmentAccount.class));
        }

        @Test
        @DisplayName("throw exception when adding account: nickname already in use")
        void throwExceptionWhenAddingAccountNicknameAlreadyInUse() {
            when(investmentAccountRepo.existsByNickname(testInvestmentAccountDto1.nickname())).thenReturn(true);

            ResponseStatusException result = assertThrows(ResponseStatusException.class,
                    () -> service.addAccount(testInvestmentAccountDto1));

            assertEquals(HttpStatus.CONFLICT, result.getStatusCode());
            assertEquals("Nickname is already in use.", result.getReason());

            verify(investmentAccountRepo, never()).save(any(InvestmentAccount.class));
        }

        @Test
        @DisplayName("throw exception when adding account: user doesn't exist")
        void throwExceptionWhenAddingAccountUserDoesntExists() {

            when(investmentAccountRepo.existsByNickname(testInvestmentAccountDto1.nickname())).thenReturn(false);
            when(userRepo.findById(testInvestmentAccountDto1.userId())).thenReturn(Optional.empty());

            ResponseStatusException result = assertThrows(ResponseStatusException.class,
                    () -> service.addAccount(testInvestmentAccountDto1));

            assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
            assertEquals("User with id " + testInvestmentAccountDto1.userId() + " does not exist in the database.",
                    result.getReason());

            verify(investmentAccountRepo, never()).save(any(InvestmentAccount.class));

        }
    }

    @Nested
    @DisplayName("updateAccount()")
    class updateAccount {

        @Test
        @DisplayName("update account successful")
        void updateAccountSuccess() {
            when(investmentAccountRepo.findById(testInvestmentAccount1.getId()))
                    .thenReturn(Optional.of(testInvestmentAccount1));
            //when(investmentAccountRepo.existsByNickname(testInvestmentAccountDto1.nickname())).thenReturn(false);
            when(userRepo.findById(testInvestmentAccountDto2.userId())).thenReturn(Optional.of(testUser1));

            when(investmentAccountRepo.save(any(InvestmentAccount.class))).thenAnswer(i -> i.getArgument(0));

            InvestmentAccount result = service.updateAccount(testInvestmentAccount1.getId(), testInvestmentAccountDto2);

            assertEquals(testInvestmentAccount2.getNickname(), result.getNickname());
            assertEquals(testInvestmentAccount2.getAccountType(), result.getAccountType());
            assertEquals(testInvestmentAccount2.getInstitutionName(), result.getInstitutionName());
            assertEquals(testInvestmentAccount2.getDateOpened(), result.getDateOpened());
            assertEquals(testUser1, result.getUser());

            verify(investmentAccountRepo).save(any(InvestmentAccount.class));
        }

        @Test
        @DisplayName("update account successful: nickname unchanged")
        void updateAccountSuccessNicknameUnchanged() {
            InvestmentAccountDto sameNicknameDto = new InvestmentAccountDto(testInvestmentAccount1.getNickname(),
                    testInvestmentAccount2.getAccountType(), testInvestmentAccount2.getInstitutionName(),
                    testInvestmentAccount2.getDateOpened(), testUser1.getId());

            when(investmentAccountRepo.findById(testInvestmentAccount1.getId()))
                    .thenReturn(Optional.of(testInvestmentAccount1));
            when(userRepo.findById(testUser1.getId())).thenReturn(Optional.of(testUser1));
            when(investmentAccountRepo.save(any(InvestmentAccount.class))).thenAnswer(i -> i.getArgument(0));

            InvestmentAccount result = service.updateAccount(testInvestmentAccount1.getId(), sameNicknameDto);

            assertEquals(testInvestmentAccount1.getNickname(), result.getNickname());
            verify(investmentAccountRepo).save(any(InvestmentAccount.class));
            verify(investmentAccountRepo, never()).existsByNickname(anyString());
        }

        @Test
        @DisplayName("update account successful: nickname not in use")
        void updateAccountSuccessNicknameNotUsed() {
            when(investmentAccountRepo.findById(testInvestmentAccount1.getId()))
                    .thenReturn(Optional.of(testInvestmentAccount1));
            when(investmentAccountRepo.existsByNickname(testInvestmentAccountDto3.nickname())).thenReturn(false);
            when(userRepo.findById(testInvestmentAccountDto2.userId())).thenReturn(Optional.of(testUser1));

            //ResponseStatusException result = assertThrows(ResponseStatusException.class, () -> service.updateAccount(testInvestmentAccount1.getId(), testInvestmentAccountDto3));
            when(investmentAccountRepo.save(any(InvestmentAccount.class))).thenAnswer(i -> i.getArgument(0));

            InvestmentAccount result = service.updateAccount(testInvestmentAccount1.getId(), testInvestmentAccountDto2);

            assertEquals(testInvestmentAccount2.getNickname(), result.getNickname());
            assertEquals(testInvestmentAccount2.getAccountType(), result.getAccountType());
            assertEquals(testInvestmentAccount2.getInstitutionName(), result.getInstitutionName());
            assertEquals(testInvestmentAccount2.getDateOpened(), result.getDateOpened());
            assertEquals(testUser1, result.getUser());

            verify(investmentAccountRepo).save(any(InvestmentAccount.class));
        }

        @Test
        @DisplayName("throw exception when updating account: nickname already in use")
        void throwExceptionWhenUpdatingAccountNicknameAlreadyUsed() {
            when(investmentAccountRepo.findById(testInvestmentAccount1.getId()))
                    .thenReturn(Optional.of(testInvestmentAccount1));
            when(investmentAccountRepo.existsByNickname(testInvestmentAccountDto3.nickname())).thenReturn(true);

            ResponseStatusException result = assertThrows(ResponseStatusException.class,
                    () -> service.updateAccount(testInvestmentAccount1.getId(), testInvestmentAccountDto3));

            assertEquals(HttpStatus.CONFLICT, result.getStatusCode());
            assertEquals("Nickname is already in use.", result.getReason());

            verify(investmentAccountRepo, never()).save(any(InvestmentAccount.class));
        }

        @Test
        @DisplayName("throw exception when updating account: user doesn't exist")
        void throwExceptionWhenUpdatingAccountUserDoesntExists() {
            when(investmentAccountRepo.findById(testInvestmentAccount1.getId()))
                    .thenReturn(Optional.of(testInvestmentAccount1));
            //when(investmentAccountRepo.existsByNickname(testInvestmentAccountDto1.nickname())).thenReturn(false);
            when(userRepo.findById(testInvestmentAccountDto2.userId())).thenReturn(Optional.empty());

            ResponseStatusException result = assertThrows(ResponseStatusException.class,
                    () -> service.updateAccount(testInvestmentAccount1.getId(), testInvestmentAccountDto2));

            assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
            assertEquals("User with id " + testInvestmentAccountDto2.userId() + " does not exist in the database.",
                    result.getReason());

            verify(investmentAccountRepo, never()).save(any(InvestmentAccount.class));

        }

        @Test
        @DisplayName("throw exception when updating account: investment doesn't exist")
        void throwExceptionWhenUpdatingAccountInvestmentDoesntExists() {
            when(investmentAccountRepo.findById(testInvestmentAccount1.getId())).thenReturn(Optional.empty());
            //when(investmentAccountRepo.existsByNickname(testInvestmentAccountDto1.nickname())).thenReturn(false);

            ResponseStatusException result = assertThrows(ResponseStatusException.class,
                    () -> service.updateAccount(testInvestmentAccount1.getId(), testInvestmentAccountDto2));

            assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
            assertEquals(
                    "Investment account with id " + testInvestmentAccount1.getId() + " does not exist in the database.",
                    result.getReason());

            verify(investmentAccountRepo, never()).save(any(InvestmentAccount.class));

        }

    }

    @Nested
    @DisplayName("deleteAccount()")
    class deleteUser {
        @Test
        @DisplayName("successfully delete an investment")
        void deleteUserSuccess() {
            when(investmentAccountRepo.existsById(1)).thenReturn(true);
            boolean result = service.deleteAccount(testInvestmentAccount1.getId());
            assertTrue(result);
            verify(investmentAccountRepo).deleteById(testInvestmentAccount1.getId());

        }

        @Test
        @DisplayName("deletion: no investment found")
        void deleteUserFailNotFound() {
            when(investmentAccountRepo.existsById(99)).thenReturn(false);

            ResponseStatusException result = assertThrows(ResponseStatusException.class,
                    () -> service.deleteAccount(99));

            assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
            assertEquals("Investment account with id 99 does not exist in the database.", result.getReason());
            verify(investmentAccountRepo, never()).deleteById(anyInt());
        }
    }

}
