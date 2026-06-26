package com.skillstorm.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skillstorm.Models.InvestmentAccount;

public interface InvestmentAccountRepo extends JpaRepository<InvestmentAccount, Integer> {

    List<InvestmentAccount> findByUserId(Long userId);

    boolean existsByNickname(String nickname);

}
