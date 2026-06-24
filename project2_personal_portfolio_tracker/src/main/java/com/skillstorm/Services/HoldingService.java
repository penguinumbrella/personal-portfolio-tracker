package com.skillstorm.Services;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.skillstorm.DTOs.HoldingDto;
import com.skillstorm.Models.Holding;
import com.skillstorm.Models.HoldingPK;
import com.skillstorm.Models.InvestmentAccount;
import com.skillstorm.Models.Security;
import com.skillstorm.Repositories.HoldingRepo;
import com.skillstorm.Repositories.InvestmentAccountRepo;
import com.skillstorm.Repositories.SecurityRepo;

@Service
public class HoldingService {

    private final HoldingRepo repo;
    private final InvestmentAccountRepo accountRepo;
    private final SecurityRepo securityRepo;

    public HoldingService(HoldingRepo repo, InvestmentAccountRepo accountRepo, SecurityRepo securityRepo) {
        this.repo = repo;
        this.accountRepo = accountRepo;
        this.securityRepo = securityRepo;
    }

    // ----- POST/CREATE METHODS -----
    public Holding addHolding(HoldingDto dto) {
        HoldingPK id = new HoldingPK(dto.a_id(), dto.s_id());

        if (repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Holding already exists in the database.");
        }
        if (!(accountRepo.existsById(dto.a_id()))) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Holding requires existing account.");
        }
        if (!(securityRepo.existsById(dto.s_id()))) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Holding requires existing Security.");
        }

        InvestmentAccount linkedAccount = accountRepo.getReferenceById(dto.a_id());
        Security linkedSecurity = securityRepo.getReferenceById(dto.s_id());

        Holding created = repo.save(new Holding(id, dto.shares(), dto.costPerShare(), dto.purchaseDate(),
                linkedAccount, linkedSecurity));
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

        InvestmentAccount linkedAccount = accountRepo.getReferenceById(dto.a_id());
        Security linkedSecurity = securityRepo.getReferenceById(dto.s_id());

        Holding updated = repo.save(new Holding(id, dto.shares(), dto.costPerShare(), dto.purchaseDate(),
                linkedAccount, linkedSecurity));

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
