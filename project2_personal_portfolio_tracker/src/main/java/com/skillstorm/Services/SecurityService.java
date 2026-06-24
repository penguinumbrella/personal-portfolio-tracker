package com.skillstorm.Services;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    // ----- CREATE METHODS -----
    public ResponseEntity<Security> addSecurity(SecurityDto dto) {
        if (repo.existsById(dto.id())) {
            return ResponseEntity.noContent().build();
        }
        Security created = repo.save(new Security(0, dto.tickerSymbol(), dto.name(), dto.sector(), dto.type(),
                dto.generalNotes(), dto.holdings()));
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // ----- READ METHODS -----
    // Read all
    public ResponseEntity<Iterable<Security>> getAllSecurities() {
        return ResponseEntity.ok(repo.findAll());
    }

    // Read one
    public ResponseEntity<Security> getSecurity(int id) {
        if (repo.findById(id).isPresent())
            return ResponseEntity.ok(repo.findById(id).get());
        throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Security with id " + id + " does not exist in the database.");
    }

    // ----- UPDATE METHODS -----
    public ResponseEntity<Security> updateSecurity(int id, SecurityDto dto) {
        if (repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Security with id " + id + " does not exist in the database.");
        }
        Security created = repo.save(new Security(id, dto.tickerSymbol(), dto.name(), dto.sector(), dto.type(),
                dto.generalNotes(), dto.holdings()));
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // ----- DELETE METHODS -----
    public ResponseEntity<Void> deleteSecurity(int id) {
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
