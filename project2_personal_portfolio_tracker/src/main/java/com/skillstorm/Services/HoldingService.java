package com.skillstorm.Services;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.skillstorm.DTOs.HoldingDto;
import com.skillstorm.Models.Holding;
import com.skillstorm.Models.HoldingPK;
import com.skillstorm.Repositories.HoldingRepo;

@Service
public class HoldingService {

    private final HoldingRepo repo;

    public HoldingService(HoldingRepo repo) {
        this.repo = repo;
    }

    // ----- CREATE METHODS -----
    public ResponseEntity<Holding> addHolding(HoldingDto dto) {
        if (repo.existsById(new HoldingPK())) {
            return ResponseEntity.noContent().build();
        }
        Holding created = repo.save(new Holding(dto.id(), dto.shares(), dto.costPerShare(), dto.purchaseDate(),
                dto.account(), dto.security()));
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // ----- READ METHODS -----
    // Read all
    public ResponseEntity<Iterable<Holding>> getAllHoldings() {
        return ResponseEntity.ok(repo.findAll());
    }

    // Read one
    public ResponseEntity<Holding> getHolding(int accountId, int securityId) {
        HoldingPK id = new HoldingPK(accountId, securityId);
        if (repo.findById(id).isPresent())
            return ResponseEntity.ok(repo.findById(id).get());
        throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Holding with id " + id + " does not exist in the database.");
    }

    // ----- UPDATE METHODS -----
    public ResponseEntity<Holding> updateHolding(int accountId, int securityId, HoldingDto dto) {
        HoldingPK id = new HoldingPK(accountId, securityId);
        if (repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Holding with id " + id + " does not exist in the database.");
        }
        Holding created = repo.save(new Holding(dto.id(), dto.shares(), dto.costPerShare(), dto.purchaseDate(),
                dto.account(), dto.security()));

        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // ----- DELETE METHODS -----
    public ResponseEntity<Void> deleteHolding(int accountId, int securityId) {
        HoldingPK id = new HoldingPK(accountId, securityId);
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
