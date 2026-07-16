package com.skillstorm.Services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.skillstorm.DTOs.HoldingDto;
import com.skillstorm.DTOs.PortfolioValuePointDto;
import com.skillstorm.Models.Holding;
import com.skillstorm.Models.HoldingPK;
import com.skillstorm.Models.InvestmentAccount;
import com.skillstorm.Models.Security;
import com.skillstorm.Repositories.HoldingRepo;
import com.skillstorm.Repositories.InvestmentAccountRepo;
import com.skillstorm.Repositories.SecurityRepo;
import com.skillstorm.Repositories.UserRepo;
import com.skillstorm.Util.RepoUtils;

@Service
public class HoldingService {

    private final HoldingRepo repo;
    private final InvestmentAccountRepo accountRepo;
    private final SecurityRepo securityRepo;
    private final UserRepo userRepo;

    public HoldingService(HoldingRepo repo, InvestmentAccountRepo accountRepo, SecurityRepo securityRepo,
            UserRepo userRepo) {
        this.repo = repo;
        this.accountRepo = accountRepo;
        this.securityRepo = securityRepo;
        this.userRepo = userRepo;
    }

    // ----- POST/CREATE METHODS -----
    /**
     * Service Method, calls repo to new holding to the holding table.
     * Ensures row does not already exist.
     * Ensures Foreign InvestmentAccount and Security exist and belong to the same User
     * @param dto
     * @return
     */
    public Holding addHolding(HoldingDto dto) {
        HoldingPK id = new HoldingPK(dto.a_id(), dto.s_id());

        if (repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Holding already exists in the database.");
        }

        Object[] links = existingAndMatching(dto.a_id(), dto.s_id());

        InvestmentAccount linkedAccount = (InvestmentAccount) links[0];
        Security linkedSecurity = (Security) links[1];

        Holding created = repo.save(new Holding(id, dto.shares(), dto.costPerShare(), dto.purchaseDate(),
                linkedAccount, linkedSecurity));
        return created;
    }

    // ----- GET/READ METHODS -----
    // Read all
    public Iterable<Holding> getAllHoldings() {
        return repo.findAll();
    }

    // Read all for one account
    public Iterable<Holding> getAllHoldingsPerAccount(int accountId) {
        return repo.findById_AccountId(accountId);
    }

    // Read all for one security
    public Iterable<Holding> getAllHoldingsPerSecurity(int securityId) {
        return repo.findById_SecurityId(securityId);
    }

    // Read one
    public Holding getHolding(int accountId, int securityId) {
        HoldingPK id = new HoldingPK(accountId, securityId);
        return RepoUtils.findOrThrow(repo, id, "Holding");
    }

    // Aggregates 

    public Long getUserHoldingTotal(Long userId) {
        RepoUtils.requireExists(userRepo, userId.intValue(), "User");
        return repo.countByAccountUserId(userId);
    }

    public Long totalInvestedCost(Long userId) {
        RepoUtils.requireExists(userRepo, userId.intValue(), "User");
        Long total = repo.totalInvestedCost(userId);
        return total != null ? total : 0L;
    }

    // ----- PUT/UPDATE METHODS -----
    public Holding updateHolding(int accountId, int securityId, HoldingDto dto) {
        HoldingPK id = new HoldingPK(accountId, securityId);
        RepoUtils.requireExists(repo, id, "Holding");

        Object[] links = existingAndMatching(accountId, securityId);

        InvestmentAccount linkedAccount = (InvestmentAccount) links[0];
        Security linkedSecurity = (Security) links[1];

        Holding updated = repo.save(new Holding(id, dto.shares(), dto.costPerShare(), dto.purchaseDate(),
                linkedAccount, linkedSecurity));

        return updated;
    }

    // ----- DELETE METHODS -----
    public boolean deleteHolding(int accountId, int securityId) {
        HoldingPK id = new HoldingPK(accountId, securityId);
        RepoUtils.requireExists(repo, id, "Holding");
        repo.deleteById(id);
        return true;
    }

    // ------ HELPER METHODS

    /**
     * Throws error if holding is using bad foreign keys
     * Throws error if holding's account and security do not have common user
     * @param a_id
     * @param s_id
     * @return array of [0] = linkedAccount [1] =  linkedSecurity
     */
    private Object[] existingAndMatching(int a_id, int s_id) {
        InvestmentAccount linkedAccount = accountRepo.findById(a_id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "Holding requires an existing account"));
        Security linkedSecurity = securityRepo.findById(s_id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "Holding requires an existing Security"));

        if (!(linkedAccount.getUser().getId() == linkedSecurity.getUser().getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Holding requires an account and security belonging to same user.");
        }

        Object[] links = { linkedAccount, linkedSecurity };

        return links;
    }

    // No historical market prices are tracked, so "value over time" is the running
    // total of cost basis (shares * costPerShare) as of each purchase date.
    public List<PortfolioValuePointDto> getPortfolioValueHistory(Long userId) {
        RepoUtils.requireExists(userRepo, userId.intValue(), "User");
        List<PortfolioValuePointDto> perDate = repo.sumCostByPurchaseDateForUser(userId);

        List<PortfolioValuePointDto> cumulative = new ArrayList<>();
        long runningTotal = 0;
        for (PortfolioValuePointDto point : perDate) {
            runningTotal += point.value();
            cumulative.add(new PortfolioValuePointDto(point.date(), runningTotal));
        }
        return cumulative;
    }

}
