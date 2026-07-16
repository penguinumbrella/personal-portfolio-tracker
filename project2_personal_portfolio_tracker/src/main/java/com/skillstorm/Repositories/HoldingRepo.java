package com.skillstorm.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.skillstorm.DTOs.PortfolioValuePointDto;
import com.skillstorm.Models.Holding;
import com.skillstorm.Models.HoldingPK;

@Repository
public interface HoldingRepo extends JpaRepository<Holding, HoldingPK> {

    //long countByUser(User user);
    long countByAccountUserId(Long userId);

    // SUM() over zero rows returns SQL NULL, so this must stay boxed (Long) rather than a
    // primitive long, which Hibernate cannot unbox a null result into
    @Query("""
            SELECT SUM(h.shares * h.costPerShare)
            FROM Holding h
            JOIN h.account a
            WHERE a.user.id = :userId
            """)
    Long totalInvestedCost(Long userId);

    // calculate the total cost of holdings for a specific account
    @Query("SELECT SUM(h.shares * h.costPerShare) FROM Holding h WHERE h.account.id = :accountId")
    Long sumCostByAccountId(int accountId);

    // per-date cost basis totals for a user, used to build the portfolio value history;
    // running total is accumulated in the service since JPQL has no window functions
    @Query("""
            SELECT new com.skillstorm.DTOs.PortfolioValuePointDto(h.purchaseDate, SUM(h.shares * h.costPerShare))
            FROM Holding h
            JOIN h.account a
            WHERE a.user.id = :userId
            GROUP BY h.purchaseDate
            ORDER BY h.purchaseDate
            """)
    List<PortfolioValuePointDto> sumCostByPurchaseDateForUser(Long userId);

    Iterable<Holding> findById_AccountId(int accountId);

    Iterable<Holding> findById_SecurityId(int securityId);
}