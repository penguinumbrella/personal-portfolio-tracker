package com.skillstorm.DTOs;

import java.util.List;

import com.skillstorm.Models.InvestmentAccount;
import com.skillstorm.Models.Security;

public record UserDto(
    String username, 
    String email, 
    String passwordHash) {

    
}
