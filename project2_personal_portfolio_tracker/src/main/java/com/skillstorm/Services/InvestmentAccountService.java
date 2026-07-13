package com.skillstorm.Services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.skillstorm.DTOs.InvestmentAccountDto;
import com.skillstorm.Models.InvestmentAccount;
import com.skillstorm.Models.User;
import com.skillstorm.Repositories.InvestmentAccountRepo;
import com.skillstorm.Repositories.UserRepo;
import com.skillstorm.Util.RepoUtils;

@Service
public class InvestmentAccountService {

    private final InvestmentAccountRepo investmentAccountRepo;
    private final UserRepo userRepo;

    public InvestmentAccountService(InvestmentAccountRepo investmentAccountRepo, UserRepo userRepo) {
        this.investmentAccountRepo = investmentAccountRepo;
        this.userRepo = userRepo;
    }

    public List<InvestmentAccount> getAccounts(Long userId) {
        if (userId == null) {
            return investmentAccountRepo.findAll();
        }
        return investmentAccountRepo.findByUserId(userId);
    }

    public InvestmentAccount getAccount(int id) {
        return RepoUtils.findOrThrow(investmentAccountRepo, id, "Investment account");
    }

    public InvestmentAccount addAccount(InvestmentAccountDto dto) {
        if (investmentAccountRepo.existsByNickname(dto.nickname())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Nickname is already in use.");
        }

        User user = RepoUtils.findOrThrow(userRepo, dto.userId(), "User");

        return investmentAccountRepo.save(
                new InvestmentAccount(0, dto.nickname(), dto.accountType(), dto.institutionName(), dto.dateOpened(),
                        user));

    }

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

    public boolean deleteAccount(int id) {
        RepoUtils.requireExists(investmentAccountRepo, id, "Investment account");
        investmentAccountRepo.deleteById(id);
        return true;
    }

    public Long getUserInvestmentAccountTotal(int userId) {
        User user = RepoUtils.findOrThrow(userRepo, userId, "User");
        return investmentAccountRepo.countByUser(user);
    }

    public List<InvestmentAccount> getRecentAccounts(Long userId) {
        return investmentAccountRepo.findTop5ByUserIdOrderByDateOpenedDesc(userId);
    }

}
