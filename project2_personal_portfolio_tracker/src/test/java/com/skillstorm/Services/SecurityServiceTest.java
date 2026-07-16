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

import com.skillstorm.DTOs.SectorBreakdownDto;
import com.skillstorm.DTOs.SecurityDto;
import com.skillstorm.DTOs.SecurityTypeBreakdownDto;
import com.skillstorm.DTOs.TopSecurityDto;
import com.skillstorm.Models.RoleType;
import com.skillstorm.Models.SectorType;
import com.skillstorm.Models.Security;
import com.skillstorm.Models.SecurityType;
import com.skillstorm.Models.User;
import com.skillstorm.Repositories.SecurityRepo;
import com.skillstorm.Repositories.UserRepo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
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
    @DisplayName("getAllSecuritiesPerUser()")
    class getAllSecuritiesPerUser {

        @Test
        @DisplayName("Success, securities for user returned")
        void getAllSecuritiesPerUserSuccess() {
            when(repo.findByUser_Id(1)).thenReturn(List.of(testSecurity1));

            Iterable<Security> result = service.getAllSecuritiesPerUser(1);

            assertNotNull(result);
            assertEquals(1, ((List<Security>) result).size());
            verify(repo).findByUser_Id(1);
        }
    }

    @Nested
    @DisplayName("getSecuritiesPerUserPaged()")
    class getSecuritiesPerUserPaged {

        @Test
        @DisplayName("Success, uses the given search term")
        void getSecuritiesPerUserPagedWithSearch() {
            Pageable pageable = Pageable.ofSize(10);
            Page<Security> page = new PageImpl<>(List.of(testSecurity1));
            when(repo.findByUser_IdAndNameContainingIgnoreCase(1, "abc", pageable)).thenReturn(page);

            Page<Security> result = service.getSecuritiesPerUserPaged(1, "abc", pageable);

            assertNotNull(result);
            assertEquals(1, result.getContent().size());
            verify(repo).findByUser_IdAndNameContainingIgnoreCase(1, "abc", pageable);
        }

        @Test
        @DisplayName("Success, null search defaults to an empty string")
        void getSecuritiesPerUserPagedNullSearch() {
            Pageable pageable = Pageable.ofSize(10);
            Page<Security> page = new PageImpl<>(List.of(testSecurity1, testSecurity2));
            when(repo.findByUser_IdAndNameContainingIgnoreCase(1, "", pageable)).thenReturn(page);

            Page<Security> result = service.getSecuritiesPerUserPaged(1, null, pageable);

            assertNotNull(result);
            assertEquals(2, result.getContent().size());
            verify(repo).findByUser_IdAndNameContainingIgnoreCase(1, "", pageable);
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

    @Nested
    @DisplayName("getUserSecurityAccountTotal()")
    class getUserSecurityAccountTotal {

        @Test
        @DisplayName("Success, total returned")
        void getUserSecurityAccountTotalSuccess() {
            when(userRepo.findById(1)).thenReturn(Optional.of(testUser1));
            when(repo.countByUser(testUser1)).thenReturn(3L);

            Long result = service.getUserSecurityAccountTotal(1);

            assertEquals(3L, result);
            verify(repo).countByUser(testUser1);
        }

        @Test
        @DisplayName("404 NOT FOUND user not found")
        void getUserSecurityAccountTotalUserNotFound() {
            when(userRepo.findById(99)).thenReturn(Optional.empty());

            ResponseStatusException except = assertThrows(ResponseStatusException.class,
                    () -> service.getUserSecurityAccountTotal(99));

            assertEquals(HttpStatus.NOT_FOUND, except.getStatusCode());
            verify(repo, never()).countByUser(any());
        }
    }

    @Nested
    @DisplayName("getTop5SecurityValues()")
    class getTop5SecurityValues {

        @Test
        @DisplayName("Success, top securities returned")
        void getTop5SecurityValuesSuccess() {
            TopSecurityDto top = new TopSecurityDto(1, "Security One", 500L);
            when(repo.findTop5SecurityValues(1)).thenReturn(List.of(top));

            Iterable<TopSecurityDto> result = service.getTop5SecurityValues(1);

            assertNotNull(result);
            assertEquals(1, ((List<TopSecurityDto>) result).size());
            verify(repo).findTop5SecurityValues(1);
        }
    }

    @Nested
    @DisplayName("getSecurityTypeBreakdown()")
    class getSecurityTypeBreakdown {

        @Test
        @DisplayName("Success, breakdown returned")
        void getSecurityTypeBreakdownSuccess() {
            SecurityTypeBreakdownDto breakdown = new SecurityTypeBreakdownDto(SecurityType.BOND, 2L);
            when(userRepo.findById(1)).thenReturn(Optional.of(testUser1));
            when(repo.countByTypeForUser(1)).thenReturn(List.of(breakdown));

            Iterable<SecurityTypeBreakdownDto> result = service.getSecurityTypeBreakdown(1);

            assertNotNull(result);
            assertEquals(1, ((List<SecurityTypeBreakdownDto>) result).size());
            verify(repo).countByTypeForUser(1);
        }

        @Test
        @DisplayName("404 NOT FOUND user not found")
        void getSecurityTypeBreakdownUserNotFound() {
            when(userRepo.findById(99)).thenReturn(Optional.empty());

            ResponseStatusException except = assertThrows(ResponseStatusException.class,
                    () -> service.getSecurityTypeBreakdown(99));

            assertEquals(HttpStatus.NOT_FOUND, except.getStatusCode());
            verify(repo, never()).countByTypeForUser(anyInt());
        }
    }

    @Nested
    @DisplayName("getSectorBreakdown()")
    class getSectorBreakdown {

        @Test
        @DisplayName("Success, breakdown returned")
        void getSectorBreakdownSuccess() {
            SectorBreakdownDto breakdown = new SectorBreakdownDto(SectorType.CONSUMER, 2L);
            when(userRepo.findById(1)).thenReturn(Optional.of(testUser1));
            when(repo.countBySectorForUser(1)).thenReturn(List.of(breakdown));

            Iterable<SectorBreakdownDto> result = service.getSectorBreakdown(1);

            assertNotNull(result);
            assertEquals(1, ((List<SectorBreakdownDto>) result).size());
            verify(repo).countBySectorForUser(1);
        }

        @Test
        @DisplayName("404 NOT FOUND user not found")
        void getSectorBreakdownUserNotFound() {
            when(userRepo.findById(99)).thenReturn(Optional.empty());

            ResponseStatusException except = assertThrows(ResponseStatusException.class,
                    () -> service.getSectorBreakdown(99));

            assertEquals(HttpStatus.NOT_FOUND, except.getStatusCode());
            verify(repo, never()).countBySectorForUser(anyInt());
        }
    }
}