package com.skillstorm.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skillstorm.Models.InvestmentAccount;

public interface InvestmentAccountRepo extends JpaRepository<InvestmentAccount, Integer>{
    
}
