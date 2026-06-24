package com.skillstorm.Services;

import org.springframework.http.HttpStatus;
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

    // ----- POST/CREATE METHODS -----
    public Holding addHolding(HoldingDto dto) {
        if (repo.existsById(dto.id())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Holding already exists in the database.");
        }
        Holding created = repo.save(new Holding(dto.id(), dto.shares(), dto.costPerShare(), dto.purchaseDate(),
                dto.account(), dto.security()));
        return created;
    }

    // ----- GET/READ METHODS -----
    // Read all
    public Iterable<Holding> getAllHoldings() {
        return repo.findAll();
    }

    // Read one
    public Holding getHolding(int accountId, int securityId) {
        HoldingPK id = new HoldingPK(accountId, securityId);
        if (repo.findById(id).isPresent())
            return repo.findById(id).get();
        throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Holding with id " + id + " does not exist in the database.");
    }

    // ----- PUT/UPDATE METHODS -----
    public Holding updateHolding(int accountId, int securityId, HoldingDto dto) {
        HoldingPK id = new HoldingPK(accountId, securityId);
        if (repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Holding with id " + id + " does not exist in the database.");
        }
        Holding updated = repo.save(new Holding(dto.id(), dto.shares(), dto.costPerShare(), dto.purchaseDate(),
                dto.account(), dto.security()));

        return updated;
    }

    // ----- DELETE METHODS -----
    public boolean deleteHolding(int accountId, int securityId) {
        HoldingPK id = new HoldingPK(accountId, securityId);
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Holding with id " + id + " does not exist in the database.");
        }
        repo.deleteById(id);
        return true;
    }

}
