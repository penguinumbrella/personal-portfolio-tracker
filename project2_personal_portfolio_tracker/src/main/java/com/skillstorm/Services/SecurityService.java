package com.skillstorm.Services;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.skillstorm.DTOs.SecurityDto;
import com.skillstorm.Models.Security;
import com.skillstorm.Repositories.SecurityRepo;

@Service
public class SecurityService {

    private final SecurityRepo repo;

    public SecurityService(SecurityRepo repo) {
        this.repo = repo;
    }

    // ----- POST/CREATE METHODS -----
    public Security addSecurity(SecurityDto dto) {
        if (repo.existsById(dto.id())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Security already exists in the database.");
        }
        Security created = repo.save(new Security(0, dto.tickerSymbol(), dto.name(), dto.sector(), dto.type(),
                dto.generalNotes(), dto.user()));
        return created;
    }

    // ----- GET/READ METHODS -----
    // Read all
    public Iterable<Security> getAllSecurities() {
        return repo.findAll();
    }

    // Read one
    public Security getSecurity(int id) {
        if (repo.findById(id).isPresent())
            return repo.findById(id).get();
        throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Security with id " + id + " does not exist in the database.");
    }

    // ----- PUT/UPDATE METHODS -----
    public Security updateSecurity(int id, SecurityDto dto) {
        if (repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Security with id " + id + " does not exist in the database.");
        }
        Security updated = repo.save(new Security(id, dto.tickerSymbol(), dto.name(), dto.sector(), dto.type(),
                dto.generalNotes(), dto.user()));
        return updated;
    }

    // ----- DELETE METHODS -----
    public boolean deleteSecurity(int id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Security with id " + id + " does not exist in the database.");
        }
        repo.deleteById(id);
        return true;
    }
}
