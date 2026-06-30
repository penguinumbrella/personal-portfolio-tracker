package com.skillstorm.Services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.skillstorm.DTOs.SecurityDto;
import com.skillstorm.Models.InvestmentAccount;
import com.skillstorm.Models.Security;
import com.skillstorm.Models.User;
import com.skillstorm.Repositories.SecurityRepo;
import com.skillstorm.Repositories.UserRepo;

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

    // Read one
    public Security getSecurity(int id) {
        return repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Security with id " + id + " does not exist in the database."));
    }

    // ----- PUT/UPDATE METHODS -----
    public Security updateSecurity(int id, SecurityDto dto) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Security with id " + id + " does not exist in the database.");
        }

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
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Security with id " + id + " does not exist in the database.");
        }
        repo.deleteById(id);
        return true;
    }

    public Long UserSecurityAccountTotal(int userId) {
        User user = userRepo.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
        return repo.countByUser(user);
        
    }

    public List<Security> getRecentAccounts(Long userId) {
        return repo.findTop5ByUserIdOrderByDateOpenedDesc(userId);
    }
}
