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

    // ----- GET/READ METHODS -----
    public List<InvestmentAccount> getAccounts(Long userId) {
        if (userId == null) {
            return investmentAccountRepo.findAll();
        }
        return investmentAccountRepo.findByUserId(userId);
    }

    public Page<InvestmentAccount> getAccountsPaged(Long userId, String search, Pageable pageable) {
        return investmentAccountRepo.findByUserIdAndNicknameContainingIgnoreCase(userId, search == null ? "" : search,
                pageable);
    }

    public InvestmentAccount getAccount(int id) {
        return RepoUtils.findOrThrow(investmentAccountRepo, id, "Investment account");
    }

    // Aggregate helpers

    public Long getAccountTotalCost(int accountId) {
        return holdingRepo.sumCostByAccountId(accountId);
    }

    public Long getUserInvestmentAccountTotal(int userId) {
        User user = RepoUtils.findOrThrow(userRepo, userId, "User");
        return investmentAccountRepo.countByUser(user);
    }

    public List<InvestmentAccount> getRecentAccounts(Long userId) {
        return investmentAccountRepo.findTop5ByUserIdOrderByDateOpenedDesc(userId);
    }

    public Iterable<AccountTypeBreakdownDto> getAccountTypeBreakdown(int userId) {
        RepoUtils.findOrThrow(userRepo, userId, "User");
        return investmentAccountRepo.countByAccountTypeForUser(userId);
    }

    // ----- POST/CREATE METHODS -----
    public InvestmentAccount addAccount(InvestmentAccountDto dto) {
        if (investmentAccountRepo.existsByNickname(dto.nickname())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Nickname is already in use.");
        }

        User user = RepoUtils.findOrThrow(userRepo, dto.userId(), "User");

        return investmentAccountRepo.save(
                new InvestmentAccount(0, dto.nickname(), dto.accountType(), dto.institutionName(), dto.dateOpened(),
                        user));

    }

    // ----- PUT/UPDATE METHODS -----
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

    // ----- DELETE METHODS -----
    public boolean deleteAccount(int id) {
        RepoUtils.requireExists(investmentAccountRepo, id, "Investment account");
        investmentAccountRepo.deleteById(id);
        return true;
    }

}
