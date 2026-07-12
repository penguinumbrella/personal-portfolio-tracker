package com.skillstorm.Services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.skillstorm.DTOs.SecurityDto;
import com.skillstorm.Models.Security;
import com.skillstorm.Models.User;
import com.skillstorm.Repositories.SecurityRepo;
import com.skillstorm.Repositories.UserRepo;
import com.skillstorm.Util.RepoUtils;

@Service
public class SecurityService {

    private final SecurityRepo repo;
    private final UserRepo userRepo;

    public SecurityService(SecurityRepo repo, UserRepo userRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
    }

    // ----- POST/CREATE METHODS -----
    public Security addSecurity(SecurityDto dto) {
        // TODO what makes a security unique that could be checked for?
        User linkedUser = userRepo.findById(dto.userId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "Must assign security to a valid user"));
        ;

        Security created = repo.save(new Security(0, dto.tickerSymbol(), dto.name(), dto.sector(), dto.type(),
                dto.generalNotes(), linkedUser));
        return created;
    }

    // ----- GET/READ METHODS -----
    // Read all
    public Iterable<Security> getAllSecurities() {
        return repo.findAll();
    }

    // Read all per User
    public Iterable<Security> getAllSecuritiesPerUser(int userId) {
        return repo.findByUser_Id(userId);
    }

    // Read one
    public Security getSecurity(int id) {
        return RepoUtils.findOrThrow(repo, id, "Security");
    }

    // ----- PUT/UPDATE METHODS -----
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

    // ---- DELETE METHODS -----
    public boolean deleteSecurity(int id) {
        RepoUtils.requireExists(repo, id, "Security");
        repo.deleteById(id);
        return true;
    }

    public Long getUserSecurityAccountTotal(int userId) {
        User user = RepoUtils.findOrThrow(userRepo, userId, "User");
        return repo.countByUser(user);
    }

    public List<Security> getRecentSecurities(Long userId) {
        return repo.findTop5ByUser_IdOrderByIdDesc(userId);
    }

}
