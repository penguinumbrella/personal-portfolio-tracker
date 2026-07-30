package com.skillstorm.DTOs;

import java.sql.Date;

import com.skillstorm.Models.InvestmentType;

public record InvestmentAccountDto(
                String nickname,
                InvestmentType accountType,
                String institutionName,
                Date dateOpened,
                int userId) {

}
