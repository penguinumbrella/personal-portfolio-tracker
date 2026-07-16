package com.skillstorm.Services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.skillstorm.DTOs.AccountTypeBreakdownDto;
import com.skillstorm.DTOs.InvestmentAccountDto;
import com.skillstorm.Models.InvestmentAccount;
import com.skillstorm.Models.User;
import com.skillstorm.Repositories.HoldingRepo;
import com.skillstorm.Repositories.InvestmentAccountRepo;
import com.skillstorm.Repositories.UserRepo;
import com.skillstorm.Util.RepoUtils;

/** Business logic for creating, reading, updating, and deleting investment accounts, plus aggregate/breakdown queries. */
@Service
public class InvestmentAccountService {

    private final InvestmentAccountRepo investmentAccountRepo;
    private final UserRepo userRepo;
    private final HoldingRepo holdingRepo;

    public InvestmentAccountService(InvestmentAccountRepo investmentAccountRepo, UserRepo userRepo,
            HoldingRepo holdingRepo) {
        this.investmentAccountRepo = investmentAccountRepo;
        this.userRepo = userRepo;
        this.holdingRepo = holdingRepo;
    }

    /**
     * Returns all investment accounts, optionally scoped to one user.
     *
     * @param userId the user's id to filter by, or {@code null} for every account
     * @return the matching investment accounts
     */
    public List<InvestmentAccount> getAccounts(Long userId) {
        if (userId == null) {
            return investmentAccountRepo.findAll();
        }
        return investmentAccountRepo.findByUserId(userId);
    }

    /**
     * Returns a user's investment accounts, paginated and optionally filtered by nickname search.
     *
     * @param userId the user's id
     * @param search a nickname search term, or {@code null} for no filtering
     * @param pageable the requested page and sort
     * @return the requested page of investment accounts
     */
    public Page<InvestmentAccount> getAccountsPaged(Long userId, String search, Pageable pageable) {
        return investmentAccountRepo.findByUserIdAndNicknameContainingIgnoreCase(userId, search == null ? "" : search,
                pageable);
    }

    /**
     * Returns a single investment account by id.
     *
     * @param id the investment account's id
     * @return the matching investment account
     * @throws ResponseStatusException with status 404 if no such account exists
     */
    public InvestmentAccount getAccount(int id) {
        return RepoUtils.findOrThrow(investmentAccountRepo, id, "Investment account");
    }

    /**
     * Returns the total cost basis of all holdings in one account.
     *
     * @param accountId the investment account's id
     * @return the account's total cost
     */
    public Long getAccountTotalCost(int accountId) {
        return holdingRepo.sumCostByAccountId(accountId);
    }

    /**
     * Returns the total number of investment accounts a user has.
     *
     * @param userId the user's id
     * @return the user's total investment account count
     * @throws ResponseStatusException with status 404 if the user doesn't exist
     */
    public Long getUserInvestmentAccountTotal(int userId) {
        User user = RepoUtils.findOrThrow(userRepo, userId, "User");
        return investmentAccountRepo.countByUser(user);
    }

    /**
     * Returns a user's most recently opened investment accounts, for the dashboard.
     *
     * @param userId the user's id
     * @return the user's recent investment accounts
     */
    public List<InvestmentAccount> getRecentAccounts(Long userId) {
        return investmentAccountRepo.findTop5ByUserIdOrderByDateOpenedDesc(userId);
    }

    /**
     * Returns a count of a user's investment accounts grouped by account type, for the
     * account-type breakdown pie chart.
     *
     * @param userId the user's id
     * @return the user's account type breakdown
     * @throws ResponseStatusException with status 404 if the user doesn't exist
     */
    public Iterable<AccountTypeBreakdownDto> getAccountTypeBreakdown(int userId) {
        RepoUtils.findOrThrow(userRepo, userId, "User");
        return investmentAccountRepo.countByAccountTypeForUser(userId);
    }

    /**
     * Creates a new investment account.
     *
     * @param dto the account to create
     * @return the created account
     * @throws ResponseStatusException with status 409 if the nickname is already in use, or 404 if the user doesn't exist
     */
    public InvestmentAccount addAccount(InvestmentAccountDto dto) {
        if (investmentAccountRepo.existsByNickname(dto.nickname())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Nickname is already in use.");
        }

        User user = RepoUtils.findOrThrow(userRepo, dto.userId(), "User");

        return investmentAccountRepo.save(
                new InvestmentAccount(0, dto.nickname(), dto.accountType(), dto.institutionName(), dto.dateOpened(),
                        user));

    }

    /**
     * Updates an existing investment account.
     *
     * @param id the investment account's id
     * @param dto the updated account data
     * @return the updated account
     * @throws ResponseStatusException with status 404 if the account or user doesn't exist, or 409
     *         if the new nickname is already in use by another account
     */
    public InvestmentAccount updateAccount(int id, InvestmentAccountDto dto) {
        InvestmentAccount investmentAccount = RepoUtils.findOrThrow(investmentAccountRepo, id, "Investment account");

        if (!investmentAccount.getNickname().equals(dto.nickname())
                && investmentAccountRepo.existsByNickname(dto.nickname())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Nickname is already in use.");
        }

        User user = RepoUtils.findOrThrow(userRepo, dto.userId(), "User");

        return investmentAccountRepo.save(new InvestmentAccount(id, dto.nickname(), dto.accountType(),
                dto.institutionName(), dto.dateOpened(), user));

    }

    /**
     * Deletes an investment account.
     *
     * @param id the investment account's id
     * @return {@code true} once the account has been deleted
     * @throws ResponseStatusException with status 404 if no such account exists
     */
    public boolean deleteAccount(int id) {
        RepoUtils.requireExists(investmentAccountRepo, id, "Investment account");
        investmentAccountRepo.deleteById(id);
        return true;
    }

}
