package com.skillstorm.DTOs;

import java.sql.Date;
import java.util.List;

import com.skillstorm.Models.Holding;
import com.skillstorm.Models.InvestmentType;
import com.skillstorm.Models.User;

public record InvestmentAccountDto(
        String nickname,
        InvestmentType accountType,
        String institutionName,
        Date dateOpened,
        int userId,
        List<Holding> holdings) {

}
