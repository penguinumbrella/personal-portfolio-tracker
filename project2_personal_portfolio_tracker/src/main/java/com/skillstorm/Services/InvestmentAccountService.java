package com.skillstorm.Services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    public Iterable<InvestmentAccount> getAll() {
        return investmentAccountRepo.findAll();
    }

    public Iterable<InvestmentAccount> getAccounts(long userId) {
        return investmentAccountRepo.findByUserId(userId);
    }

    public InvestmentAccount addAccount(int userId, InvestmentAccountDto dto) {
        if (userRepo.existsById(userId)) {
            if (investmentAccountRepo.existsByNickname(dto.nickname())) throw new ResponseStatusException(HttpStatus.CONFLICT, "Nickname is already in use.");
            User user = userRepo.findById(dto.userId()).get();
            return 
                    investmentAccountRepo.save(
                            new InvestmentAccount(0, dto.nickname(), dto.accountType(), dto.dateOpened(), user, dto.holdings()
                                    ));
        }

        throw new ResponseStatusException(HttpStatus.NOT_FOUND,
            "User with id " + userId + " does not exist in the database.");

    }

    public InvestmentAccount updateAccount(int id, InvestmentAccountDto dto) {
        if (investmentAccountRepo.existsById(id)) {
            InvestmentAccount investmentAccount = investmentAccountRepo.findById(id).get();
            if (!investmentAccount.getNickname().equals(dto.nickname()) && investmentAccountRepo.existsByNickname(dto.nickname())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Nickname is already in use."
                );
            }
            User user = userRepo.findById(dto.userId()).get();
            return 
                    investmentAccountRepo.save(new InvestmentAccount(id, dto.nickname(), dto.accountType(),
                            dto.dateOpened(), user, dto.holdings()));
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND,
            "Investment account with id " + id + " does not exist in the database.");

    }

    public boolean deleteAccount(int id) {
        if (investmentAccountRepo.existsById(id)) {
            investmentAccountRepo.deleteById(id);
            return true;
        }

        throw new ResponseStatusException(HttpStatus.NOT_FOUND,
            "Investment account with id " + id + " does not exist in the database.");
        
    }

}
