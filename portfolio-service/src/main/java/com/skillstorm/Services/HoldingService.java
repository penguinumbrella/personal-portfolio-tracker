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

/** Business logic for creating, reading, updating, and deleting holdings, plus aggregate/history queries. */
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

    /**
     * Creates a new holding. Ensures the account/security pair doesn't already have a holding,
     * and that the account and security both exist and belong to the same user.
     *
     * @param dto the holding to create
     * @return the created holding
     * @throws ResponseStatusException with status 409 if the holding already exists, or 403 if the
     *         account/security don't exist or don't belong to the same user
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

    /**
     * Returns every holding across all accounts and securities.
     *
     * @return all holdings
     */
    public Iterable<Holding> getAllHoldings() {
        return repo.findAll();
    }

    /**
     * Returns all holdings for one investment account.
     *
     * @param accountId the investment account's id
     * @return the account's holdings
     */
    public Iterable<Holding> getAllHoldingsPerAccount(int accountId) {
        return repo.findById_AccountId(accountId);
    }

    /**
     * Returns all holdings of one security, across accounts.
     *
     * @param securityId the security's id
     * @return the holdings of that security
     */
    public Iterable<Holding> getAllHoldingsPerSecurity(int securityId) {
        return repo.findById_SecurityId(securityId);
    }

    /**
     * Returns a single holding by its account/security composite key.
     *
     * @param accountId the investment account's id
     * @param securityId the security's id
     * @return the matching holding
     * @throws ResponseStatusException with status 404 if no such holding exists
     */
    public Holding getHolding(int accountId, int securityId) {
        HoldingPK id = new HoldingPK(accountId, securityId);
        return RepoUtils.findOrThrow(repo, id, "Holding");
    }

    /**
     * Returns the total number of holdings a user has across all their accounts.
     *
     * @param userId the user's id
     * @return the user's total holding count
     * @throws ResponseStatusException with status 404 if the user doesn't exist
     */
    public Long getUserHoldingTotal(Long userId) {
        RepoUtils.requireExists(userRepo, userId.intValue(), "User");
        return repo.countByAccountUserId(userId);
    }

    /**
     * Returns the total cost basis (shares &times; cost per share) invested by a user across all holdings.
     *
     * @param userId the user's id
     * @return the user's total invested cost, or 0 if they have no holdings
     * @throws ResponseStatusException with status 404 if the user doesn't exist
     */
    public Long totalInvestedCost(Long userId) {
        RepoUtils.requireExists(userRepo, userId.intValue(), "User");
        Long total = repo.totalInvestedCost(userId);
        return total != null ? total : 0L;
    }

    /**
     * Updates an existing holding.
     *
     * @param accountId the investment account's id
     * @param securityId the security's id
     * @param dto the updated holding data
     * @return the updated holding
     * @throws ResponseStatusException with status 404 if the holding doesn't exist, or 403 if the
     *         account/security don't exist or don't belong to the same user
     */
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

    /**
     * Deletes a holding.
     *
     * @param accountId the investment account's id
     * @param securityId the security's id
     * @return {@code true} once the holding has been deleted
     * @throws ResponseStatusException with status 404 if the holding doesn't exist
     */
    public boolean deleteHolding(int accountId, int securityId) {
        HoldingPK id = new HoldingPK(accountId, securityId);
        RepoUtils.requireExists(repo, id, "Holding");
        repo.deleteById(id);
        return true;
    }

    /**
     * Looks up the account and security for a holding, throwing if either foreign key is bad or
     * if the account and security don't belong to the same user.
     *
     * @param a_id the investment account's id
     * @param s_id the security's id
     * @return a two-element array: {@code [0]} the linked account, {@code [1]} the linked security
     * @throws ResponseStatusException with status 403 if either doesn't exist or they belong to different users
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

    /**
     * Returns a user's cumulative portfolio value over time. No historical market prices are
     * tracked, so "value over time" is the running total of cost basis (shares &times; cost per
     * share) as of each purchase date.
     *
     * @param userId the user's id
     * @return the user's portfolio value history, ordered by date
     * @throws ResponseStatusException with status 404 if the user doesn't exist
     */
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
