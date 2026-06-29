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

import com.skillstorm.DTOs.SecurityDto;
import com.skillstorm.Models.SectorType;
import com.skillstorm.Models.Security;
import com.skillstorm.Models.SecurityType;
import com.skillstorm.Models.User;
import com.skillstorm.Repositories.SecurityRepo;
import com.skillstorm.Repositories.UserRepo;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
@DisplayName("SecurityService - Service Layer Tests")
public class SecurityServiceTest {

    @Mock
    private SecurityRepo repo;

    @Mock
    private UserRepo userRepo;

    @InjectMocks
    private SecurityService service;

    private Security testSecurity1;
    private Security testSecurity2;
    private SecurityDto testSDto1;
    private SecurityDto testSDto2;
    private User testUser1;
    private User testUser2;

    @BeforeEach
    void dataInit() {
        testUser1 = new User(1, "plswork", "plswork@test.com", "hash");
        testUser2 = new User(2, "diff", "diff@test.com", "diff");

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
    @DisplayName("addSecurity()")
    class addSecurity {

        @Test
        @DisplayName("Success security created")
        void addSecuritySuccess() {
            when(userRepo.findById(1)).thenReturn(Optional.of(testUser1));
            when(repo.save(any(Security.class))).thenReturn(testSecurity1);

            Security result = service.addSecurity(testSDto1);

            assertNotNull(result);
            assertEquals("abc", result.getTickerSymbol());
            assertEquals("Security One", result.getName());
            assertEquals(SectorType.CONSUMER, result.getSector());
            assertEquals(SecurityType.BOND, result.getType());
            assertEquals("one", result.getGeneralNotes());
            assertEquals(testUser1, result.getUser());
            verify(repo).save(any(Security.class));
        }

        @Test
        @DisplayName("Forbidden post user not found")
        void addSecurityUserNotFound() {
            when(userRepo.findById(1)).thenReturn(Optional.empty());

            ResponseStatusException except = assertThrows(ResponseStatusException.class,
                    () -> service.addSecurity(testSDto1));

            assertEquals(HttpStatus.FORBIDDEN, except.getStatusCode());
            verify(repo, never()).save(any(Security.class));
        }
    }

    // ----- GET/READ TESTS -----
    @Nested
    @DisplayName("getAllSecurities()")
    class getAllSecurities {

        @Test
        @DisplayName("Success all securities returned")
        void getAllSecuritiesSuccess() {
            when(repo.findAll()).thenReturn(List.of(testSecurity1, testSecurity2));

            Iterable<Security> result = service.getAllSecurities();

            assertNotNull(result);
            assertEquals(2, ((List<Security>) result).size());
            verify(repo).findAll();
        }
    }

    @Nested
    @DisplayName("getSecurity()")
    class getSecurity {

        @Test
        @DisplayName("Success, security returned")
        void getSecuritySuccess() {
            when(repo.findById(1)).thenReturn(Optional.of(testSecurity1));

            Security result = service.getSecurity(1);

            assertNotNull(result);
            assertEquals("abc", result.getTickerSymbol());
            assertEquals("Security One", result.getName());
            verify(repo).findById(1);
        }

        @Test
        @DisplayName("404 security not found")
        void getSecurityNotFound() {
            when(repo.findById(1)).thenReturn(Optional.empty());

            ResponseStatusException except = assertThrows(ResponseStatusException.class,
                    () -> service.getSecurity(1));

            assertEquals(HttpStatus.NOT_FOUND, except.getStatusCode());
        }
    }

    // ----- PUT/UPDATE TESTS -----
    @Nested
    @DisplayName("updateSecurity()")
    class updateSecurity {

        @Test
        @DisplayName("Success security updated and returned")
        void updateSecuritySuccess() {
            when(repo.existsById(2)).thenReturn(true);
            when(userRepo.findById(2)).thenReturn(Optional.of(testUser2));
            when(repo.save(any(Security.class))).thenReturn(testSecurity2);

            Security result = service.updateSecurity(2, testSDto2);

            assertNotNull(result);
            assertEquals("xyz", result.getTickerSymbol());
            assertEquals("Security Two", result.getName());
            verify(repo).save(any(Security.class));
        }

        @Test
        @DisplayName("404 NOT FOUND security not found")
        void updateSecurityNotFound() {
            when(repo.existsById(1)).thenReturn(false);

            ResponseStatusException except = assertThrows(ResponseStatusException.class,
                    () -> service.updateSecurity(1, testSDto1));

            assertEquals(HttpStatus.NOT_FOUND, except.getStatusCode());
            verify(repo, never()).save(any(Security.class));
        }

        @Test
        @DisplayName("Forbidden put/update user not found")
        void updateSecurityUserNotFound() {
            when(repo.existsById(1)).thenReturn(true);
            when(userRepo.findById(1)).thenReturn(Optional.empty());

            ResponseStatusException except = assertThrows(ResponseStatusException.class,
                    () -> service.updateSecurity(1, testSDto1));

            assertEquals(HttpStatus.FORBIDDEN, except.getStatusCode());
            verify(repo, never()).save(any(Security.class));
        }
    }

    // ---- DELETE TESTS -----
    @Nested
    @DisplayName("deleteSecurity()")
    class deleteSecurity {

        @Test
        @DisplayName("Success security deleted, returns true")
        void deleteSecuritySuccess() {
            when(repo.existsById(1)).thenReturn(true);

            boolean result = service.deleteSecurity(1);

            assertTrue(result);
            verify(repo).deleteById(1);
        }

        @Test
        @DisplayName("404 security not found")
        void deleteSecurityNotFound() {
            when(repo.existsById(1)).thenReturn(false);

            ResponseStatusException except = assertThrows(ResponseStatusException.class,
                    () -> service.deleteSecurity(1));

            assertEquals(HttpStatus.NOT_FOUND, except.getStatusCode());
            verify(repo, never()).deleteById(any());
        }
    }
}