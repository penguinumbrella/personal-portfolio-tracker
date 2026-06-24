package com.skillstorm.DTOs;

import java.sql.Date;

import com.skillstorm.Models.HoldingPK;
import com.skillstorm.Models.InvestmentAccount;
import com.skillstorm.Models.Security;

public record HoldingDto(HoldingPK id, int shares, int costPerShare, Date purchaseDate, InvestmentAccount account,
        Security security) {

}
