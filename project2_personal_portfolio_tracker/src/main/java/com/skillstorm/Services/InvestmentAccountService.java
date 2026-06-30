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

@Service
public class InvestmentAccountService {

    private final InvestmentAccountRepo investmentAccountRepo;
    private final UserRepo userRepo;

    public InvestmentAccountService(InvestmentAccountRepo investmentAccountRepo, UserRepo userRepo) {
        this.investmentAccountRepo = investmentAccountRepo;
        this.userRepo = userRepo;
    }

    /*
    public Iterable<InvestmentAccount> getAll() {
        return investmentAccountRepo.findAll();
    }
    
    */
    public List<InvestmentAccount> getAccounts(Long userId) {
        if (userId == null) {
            return investmentAccountRepo.findAll();
        }
        return investmentAccountRepo.findByUserId(userId);
    }

    public InvestmentAccount addAccount(InvestmentAccountDto dto) {
        if (investmentAccountRepo.existsByNickname(dto.nickname())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Nickname is already in use.");
        }
            
        User user = userRepo.findById(dto.userId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));

        return investmentAccountRepo.save(
                new InvestmentAccount(0, dto.nickname(), dto.accountType(), dto.institutionName(), dto.dateOpened(), user));
        

    }

    public InvestmentAccount updateAccount(int id, InvestmentAccountDto dto) {
        InvestmentAccount investmentAccount = investmentAccountRepo.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Investment account with id " + id + " does not exist in the database."));
            
        if (!investmentAccount.getNickname().equals(dto.nickname()) && investmentAccountRepo.existsByNickname(dto.nickname())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Nickname is already in use.");
        }

        User user = userRepo.findById(dto.userId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
        
        return investmentAccountRepo.save(new InvestmentAccount(0, dto.nickname(), dto.accountType(),
                dto.institutionName(), dto.dateOpened(), user));


    }

    public boolean deleteAccount(int id) {
        if (investmentAccountRepo.existsById(id)) {
            investmentAccountRepo.deleteById(id);
            return true;
        }

        throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Investment account with id " + id + " does not exist in the database.");

    }

    public Long UserInvestmentAccountTotal(int userId) {
        User user = userRepo.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
        return investmentAccountRepo.countByUser(user);
        
    }

    public List<InvestmentAccount> getRecentAccounts(Long userId) {
        return investmentAccountRepo.findTop5ByUserIdOrderByDateOpenedDesc(userId);
    }



}
