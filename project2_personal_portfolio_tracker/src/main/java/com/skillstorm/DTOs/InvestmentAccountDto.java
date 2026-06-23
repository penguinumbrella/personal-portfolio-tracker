package com.skillstorm.DTOs;

import java.sql.Date;

import com.skillstorm.Models.InvestmentType;
import com.skillstorm.Models.User;

public record InvestmentAccountDto(
    String nickname,
    InvestmentType accountType,
    String institutionName,
    Date dateOpened
    ) {
    
}
