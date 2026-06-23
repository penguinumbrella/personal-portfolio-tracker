package com.skillstorm.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

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

    public ResponseEntity<Iterable<InvestmentAccount>> getAll() {
        return ResponseEntity.ok(investmentAccountRepo.findAll());
    }

    public ResponseEntity<Iterable<InvestmentAccount>> getUserAccounts(int userId) {
        return ResponseEntity.ok(investmentAccountRepo.findByUserId(userId));
    }

    public ResponseEntity<InvestmentAccount> addUserAccount(int userId, InvestmentAccountDto dto) {
        if (userRepo.existsById(userId)) {
            Optional<User> userOptional = userRepo.findById(userId);
            User user;
            if (userOptional.isPresent()) {
                user = userOptional.get();
            } else {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.status(201).body(
                investmentAccountRepo.save(new InvestmentAccount(0, dto.nickname(), dto.accountType(), dto.institutionName(), dto.dateOpened(), user
            ))
            );
        }

        return ResponseEntity.notFound().build();
        
    }

    public ResponseEntity<InvestmentAccount> editUserAccount(int userId, int id, InvestmentAccountDto dto) {
        if (userRepo.existsById(userId)) {
            Optional<User> userOptional = userRepo.findById(userId);
            User user;
            if (userOptional.isPresent()) {
                user = userOptional.get();
            } else {
                return ResponseEntity.notFound().build();
            }
            
            if (investmentAccountRepo.existsById(id)) {
            return ResponseEntity.status(HttpStatus.OK).body(
                investmentAccountRepo.save(new InvestmentAccount(id, dto.nickname(), dto.accountType(), dto.institutionName(), dto.dateOpened(), user
            ))
            );
        }
        }
        
        return ResponseEntity.notFound().build();

    }

    public ResponseEntity<Void> deleteUserAccount(int id) {
        investmentAccountRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
}
