package com.skillstorm.Services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.skillstorm.DTOs.SectorBreakdownDto;
import com.skillstorm.DTOs.SecurityDto;
import com.skillstorm.DTOs.SecurityTypeBreakdownDto;
import com.skillstorm.DTOs.TopSecurityDto;
import com.skillstorm.Models.Security;
import com.skillstorm.Models.User;
import com.skillstorm.Repositories.SecurityRepo;
import com.skillstorm.Repositories.UserRepo;
import com.skillstorm.Util.RepoUtils;

/** Business logic for creating, reading, updating, and deleting securities, plus aggregate/breakdown queries. */
@Service
public class SecurityService {

    private final SecurityRepo repo;
    private final UserRepo userRepo;

    public SecurityService(SecurityRepo repo, UserRepo userRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
    }

    /**
     * Creates a new security.
     *
     * @param dto the security to create
     * @return the created security
     * @throws ResponseStatusException with status 403 if the assigned user doesn't exist
     */
    public Security addSecurity(SecurityDto dto) {
        User linkedUser = userRepo.findById(dto.userId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "Must assign security to a valid user"));
        ;

        Security created = repo.save(new Security(0, dto.tickerSymbol(), dto.name(), dto.sector(), dto.type(),
                dto.generalNotes(), linkedUser));
        return created;
    }

    /**
     * Returns every security across all users.
     *
     * @return all securities
     */
    public Iterable<Security> getAllSecurities() {
        return repo.findAll();
    }

    /**
     * Returns all securities belonging to one user.
     *
     * @param userId the user's id
     * @return the user's securities
     */
    public Iterable<Security> getAllSecuritiesPerUser(int userId) {
        return repo.findByUser_Id(userId);
    }

    /**
     * Returns a user's securities, paginated and optionally filtered by name search.
     *
     * @param userId the user's id
     * @param search a name search term, or {@code null} for no filtering
     * @param pageable the requested page and sort
     * @return the requested page of securities
     */
    public Page<Security> getSecuritiesPerUserPaged(int userId, String search, Pageable pageable) {
        return repo.findByUser_IdAndNameContainingIgnoreCase(userId, search == null ? "" : search, pageable);
    }

    /**
     * Returns a single security by id.
     *
     * @param id the security's id
     * @return the matching security
     * @throws ResponseStatusException with status 404 if no such security exists
     */
    public Security getSecurity(int id) {
        return RepoUtils.findOrThrow(repo, id, "Security");
    }

    /**
     * Returns the total number of securities a user has.
     *
     * @param userId the user's id
     * @return the user's total security count
     * @throws ResponseStatusException with status 404 if the user doesn't exist
     */
    public Long getUserSecurityAccountTotal(int userId) {
        User user = RepoUtils.findOrThrow(userRepo, userId, "User");
        return repo.countByUser(user);
    }

    /**
     * Returns a user's top 5 securities by total value, for the dashboard.
     *
     * @param userId the user's id
     * @return the user's top securities
     */
    public Iterable<TopSecurityDto> getTop5SecurityValues(int userId) {
        return repo.findTop5SecurityValues(userId);
    }

    /**
     * Returns a count of a user's securities grouped by security type, for the
     * security-type breakdown pie chart.
     *
     * @param userId the user's id
     * @return the user's security type breakdown
     * @throws ResponseStatusException with status 404 if the user doesn't exist
     */
    public Iterable<SecurityTypeBreakdownDto> getSecurityTypeBreakdown(int userId) {
        RepoUtils.findOrThrow(userRepo, userId, "User");
        return repo.countByTypeForUser(userId);
    }

    /**
     * Returns a count of a user's securities grouped by sector, for the sector breakdown pie chart.
     *
     * @param userId the user's id
     * @return the user's sector breakdown
     * @throws ResponseStatusException with status 404 if the user doesn't exist
     */
    public Iterable<SectorBreakdownDto> getSectorBreakdown(int userId) {
        RepoUtils.findOrThrow(userRepo, userId, "User");
        return repo.countBySectorForUser(userId);
    }

    /**
     * Updates an existing security.
     *
     * @param id the security's id
     * @param dto the updated security data
     * @return the updated security
     * @throws ResponseStatusException with status 404 if the security doesn't exist, or 403 if the assigned user doesn't exist
     */
    public Security updateSecurity(int id, SecurityDto dto) {
        RepoUtils.requireExists(repo, id, "Security");

        User linkedUser = userRepo.findById(dto.userId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "Must assign security to a valid user"));
        ;
        Security updated = repo.save(new Security(id, dto.tickerSymbol(), dto.name(), dto.sector(), dto.type(),
                dto.generalNotes(), linkedUser));
        return updated;
    }

    /**
     * Deletes a security.
     *
     * @param id the security's id
     * @return {@code true} once the security has been deleted
     * @throws ResponseStatusException with status 404 if no such security exists
     */
    public boolean deleteSecurity(int id) {
        RepoUtils.requireExists(repo, id, "Security");
        repo.deleteById(id);
        return true;
    }

}
