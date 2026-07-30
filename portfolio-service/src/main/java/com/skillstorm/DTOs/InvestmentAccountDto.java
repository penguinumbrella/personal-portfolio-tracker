package com.skillstorm.DTOs;

import java.sql.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.skillstorm.Models.InvestmentType;

public record InvestmentAccountDto(
                String nickname,
                InvestmentType accountType,
                String institutionName,
                @JsonFormat(pattern = "yyyy-MM-dd") Date dateOpened,
                int userId) {

}
