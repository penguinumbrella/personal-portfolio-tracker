package com.skillstorm.DTOs;

import java.util.List;

import com.skillstorm.Models.InvestmentAccount;

public record UserDto(
    String username, 
    String email, 
    String passwordHash,
    List<InvestmentAccount> investmentAccounts) {

    
}
