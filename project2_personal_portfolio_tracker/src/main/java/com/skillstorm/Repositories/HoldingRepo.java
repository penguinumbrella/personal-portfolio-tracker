package com.skillstorm.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.skillstorm.Models.Holding;
import com.skillstorm.Models.HoldingPK;
import com.skillstorm.Models.User;

@Repository
public interface HoldingRepo extends JpaRepository<Holding, HoldingPK> {

    //long countByUser(User user);
    long countByAccountUserId(Long userId);

    @Query("""
            SELECT SUM(h.shares * h.costPerShare)
            FROM Holding h
            JOIN h.account a
            WHERE a.user.id = :userId
            """)
    long totalInvestedCost(Long userId);

    Iterable<Holding> findById_AccountId(int accountId);

    Iterable<Holding> findById_SecurityId(int securityId);
}