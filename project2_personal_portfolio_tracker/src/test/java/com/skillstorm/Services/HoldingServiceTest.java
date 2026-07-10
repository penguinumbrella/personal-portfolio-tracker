package com.skillstorm.Services;

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

import com.skillstorm.DTOs.HoldingDto;
import com.skillstorm.Models.Holding;
import com.skillstorm.Models.HoldingPK;
import com.skillstorm.Models.InvestmentAccount;
import com.skillstorm.Models.InvestmentType;
import com.skillstorm.Models.RoleType;
import com.skillstorm.Models.SectorType;
import com.skillstorm.Models.Security;
import com.skillstorm.Models.SecurityType;
import com.skillstorm.Models.User;
import com.skillstorm.Repositories.HoldingRepo;
import com.skillstorm.Repositories.InvestmentAccountRepo;
import com.skillstorm.Repositories.SecurityRepo;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import java.sql.Date;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class HoldingServiceTest {

    @Mock
    private HoldingRepo repo;

    @Mock
    private InvestmentAccountRepo accountRepo;

    @Mock
    private SecurityRepo securityRepo;

    @InjectMocks
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
        testUser1 = new User(1, "plswork", "plswork@test.com", "hash", true, RoleType.USER);
        testAccount1 = new InvestmentAccount(1, "account One", InvestmentType.BROKERAGE, "test1",
                Date.valueOf("2026-06-25"), testUser1);
        testSecurity1 = new Security(1, "abc", "Security One", SectorType.CONSUMER, SecurityType.BOND,
                "one", testUser1);

        // Different User + account + security
        testUser2 = new User(2, "diff", "diff@test.com", "diff", true, RoleType.USER);
        testAccount2 = new InvestmentAccount(2, "Account Two", InvestmentType.HSA, "test2", Date.valueOf("2035-06-25"),
                testUser2);
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
    @DisplayName("addHolding()")
    class addHolding {

        @Test
        @DisplayName("Success holding created and returned")
        void addHoldingSuccess() {
            when(repo.existsById(testPk1)).thenReturn(false);
            when(accountRepo.findById(1)).thenReturn(Optional.of(testAccount1));
            when(securityRepo.findById(1)).thenReturn(Optional.of(testSecurity1));
            when(repo.save(any(Holding.class))).thenReturn(testHolding1);

            Holding result = service.addHolding(testHDto1);

            assertNotNull(result);
            assertEquals(9, result.getShares());
            assertEquals(99, result.getCostPerShare());
            assertEquals(Date.valueOf("2067-01-01"), result.getPurchaseDate());
            verify(repo).save(any(Holding.class));
        }

        @Test
        @DisplayName("403 FORBIDDEN holding already exists")
        void addHoldingAlreadyExists() {
            when(repo.existsById(testPk1)).thenReturn(true);

            ResponseStatusException except = assertThrows(ResponseStatusException.class,
                    () -> service.addHolding(testHDto1));

            assertEquals(HttpStatus.FORBIDDEN, except.getStatusCode());
            verify(repo, never()).save(any(Holding.class));
        }

        @Test
        @DisplayName("403 FORBIDDEN account not found")
        void addHoldingAccountNotFound() {
            when(repo.existsById(testPk1)).thenReturn(false);
            when(accountRepo.findById(1)).thenReturn(Optional.empty());

            ResponseStatusException except = assertThrows(ResponseStatusException.class,
                    () -> service.addHolding(testHDto1));

            assertEquals(HttpStatus.FORBIDDEN, except.getStatusCode());
            verify(repo, never()).save(any(Holding.class));
        }

        @Test
        @DisplayName("403 FORBIDDEN, security not found")
        void addHoldingSecurityNotFound() {
            when(repo.existsById(testPk2)).thenReturn(false);
            when(accountRepo.findById(2)).thenReturn(Optional.of(testAccount1));
            when(securityRepo.findById(2)).thenReturn(Optional.empty());

            ResponseStatusException except = assertThrows(ResponseStatusException.class,
                    () -> service.addHolding(testHDto2));

            assertEquals(HttpStatus.FORBIDDEN, except.getStatusCode());
            verify(repo, never()).save(any(Holding.class));
        }

        @Test
        @DisplayName("403 FORBIDDEN , account and security belong to different users")
        void addHoldingUserMismatch() {
            when(repo.existsById(testPk1)).thenReturn(false);
            when(accountRepo.findById(1)).thenReturn(Optional.of(testAccount1));
            when(securityRepo.findById(1)).thenReturn(Optional.of(testSecurity2)); // different user

            ResponseStatusException except = assertThrows(ResponseStatusException.class,
                    () -> service.addHolding(testHDto1));

            assertEquals(HttpStatus.FORBIDDEN, except.getStatusCode());
            verify(repo, never()).save(any(Holding.class));
        }
    }

    // ----- GET/READ TESTS -----
    @Nested
    @DisplayName("getAllHoldings()")
    class getAllHoldings {

        @Test
        @DisplayName("Success, all holdings returned")
        void getAllHoldingsSuccess() {
            when(repo.findAll()).thenReturn(List.of(testHolding1, testHolding2));

            Iterable<Holding> result = service.getAllHoldings();

            assertNotNull(result);
            assertEquals(2, ((List<Holding>) result).size());
            verify(repo).findAll();
        }
    }

    @Nested
    @DisplayName("getHolding()")
    class getHolding {

        @Test
        @DisplayName("Success holding returned")
        void getHoldingSuccess() {
            when(repo.findById(testPk1)).thenReturn(Optional.of(testHolding1));

            Holding result = service.getHolding(1, 1);

            assertNotNull(result);
            assertEquals(9, result.getShares());
            assertEquals(99, result.getCostPerShare());
            verify(repo).findById(testPk1);
        }

        @Test
        @DisplayName("404 NOT FOUND holding not found")
        void getHoldingNotFound() {
            when(repo.findById(testPk1)).thenReturn(Optional.empty());

            ResponseStatusException except = assertThrows(ResponseStatusException.class,
                    () -> service.getHolding(1, 1));

            assertEquals(HttpStatus.NOT_FOUND, except.getStatusCode());
        }
    }

    // ---- PUT/UPDATE TESTS -----
    @Nested
    @DisplayName("updateHolding()")
    class updateHolding {

        @Test
        @DisplayName("Success holding updated and returned")
        void updateHoldingSuccess() {
            when(repo.existsById(testPk1)).thenReturn(true);
            when(accountRepo.findById(1)).thenReturn(Optional.of(testAccount1));
            when(securityRepo.findById(1)).thenReturn(Optional.of(testSecurity1));
            when(repo.save(any(Holding.class))).thenReturn(testHolding1);

            Holding result = service.updateHolding(1, 1, testHDto1);

            assertNotNull(result);
            assertEquals(9, result.getShares());
            assertEquals(99, result.getCostPerShare());
            verify(repo).save(any(Holding.class));
        }

        @Test
        @DisplayName("404 NOT FOUND holding not found")
        void updateHoldingNotFound() {
            when(repo.existsById(testPk1)).thenReturn(false);

            ResponseStatusException except = assertThrows(ResponseStatusException.class,
                    () -> service.updateHolding(1, 1, testHDto1));

            assertEquals(HttpStatus.NOT_FOUND, except.getStatusCode());
            verify(repo, never()).save(any(Holding.class));
        }

        @Test
        @DisplayName("403 FORBIDDEN account not found")
        void updateHoldingAccountNotFound() {
            when(repo.existsById(testPk1)).thenReturn(true);
            when(accountRepo.findById(1)).thenReturn(Optional.empty());

            ResponseStatusException except = assertThrows(ResponseStatusException.class,
                    () -> service.updateHolding(1, 1, testHDto1));

            assertEquals(HttpStatus.FORBIDDEN, except.getStatusCode());
            verify(repo, never()).save(any(Holding.class));
        }

        @Test
        @DisplayName("403 FORBIDDEN security not found")
        void updateHoldingSecurityNotFound() {
            when(repo.existsById(testPk1)).thenReturn(true);
            when(accountRepo.findById(1)).thenReturn(Optional.of(testAccount1));
            when(securityRepo.findById(1)).thenReturn(Optional.empty());

            ResponseStatusException except = assertThrows(ResponseStatusException.class,
                    () -> service.updateHolding(1, 1, testHDto1));

            assertEquals(HttpStatus.FORBIDDEN, except.getStatusCode());
            verify(repo, never()).save(any(Holding.class));
        }

        @Test
        @DisplayName("403 FORBIDDEN, account and security belong to different users")
        void updateHoldingUserMismatch() {
            when(repo.existsById(testPk1)).thenReturn(true);
            when(accountRepo.findById(1)).thenReturn(Optional.of(testAccount1));
            when(securityRepo.findById(1)).thenReturn(Optional.of(testSecurity2)); // different user

            ResponseStatusException except = assertThrows(ResponseStatusException.class,
                    () -> service.updateHolding(1, 1, testHDto1));

            assertEquals(HttpStatus.FORBIDDEN, except.getStatusCode());
            verify(repo, never()).save(any(Holding.class));
        }
    }

    // ----- DELETE TESTS ----
    @Nested
    @DisplayName("deleteHolding()")
    class deleteHolding {

        @Test
        @DisplayName("Success holding deleted, returns true")
        void deleteHoldingSuccess() {
            when(repo.existsById(testPk1)).thenReturn(true);

            boolean result = service.deleteHolding(1, 1);

            assertTrue(result);
            verify(repo).deleteById(testPk1);
        }

        @Test
        @DisplayName("404 NOT FOUND holding not found")
        void deleteHoldingNotFound() {
            when(repo.existsById(testPk1)).thenReturn(false);

            ResponseStatusException except = assertThrows(ResponseStatusException.class,
                    () -> service.deleteHolding(1, 1));

            assertEquals(HttpStatus.NOT_FOUND, except.getStatusCode());
            verify(repo, never()).deleteById(any());
        }
    }
}
