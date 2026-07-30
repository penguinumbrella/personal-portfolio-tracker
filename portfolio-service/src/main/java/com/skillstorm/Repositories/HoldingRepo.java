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

    long countByAccountUserId(Long userId);

    /**
     * Sums the cost basis (shares &times; cost per share) of every holding belonging to a user.
     *
     * <p>{@code SUM()} over zero rows returns SQL {@code NULL}, so the result must stay boxed
     * ({@link Long}) rather than a primitive {@code long}, which Hibernate cannot unbox a null
     * result into.
     *
     * @param userId the user's id
     * @return the user's total invested cost, or {@code null} if they have no holdings
     */
    @Query("""
            SELECT SUM(h.shares * h.costPerShare)
            FROM Holding h
            JOIN h.account a
            WHERE a.user.id = :userId
            """)
    Long totalInvestedCost(Long userId);

    /**
     * Sums the cost basis (shares &times; cost per share) of every holding in one account.
     *
     * @param accountId the investment account's id
     * @return the account's total cost, or {@code null} if it has no holdings
     */
    @Query("SELECT SUM(h.shares * h.costPerShare) FROM Holding h WHERE h.account.id = :accountId")
    Long sumCostByAccountId(int accountId);

    /**
     * Sums a user's holding cost basis grouped by purchase date, for building the portfolio value
     * history. The running (cumulative) total is accumulated in the service layer, since JPQL has
     * no window functions.
     *
     * @param userId the user's id
     * @return one entry per purchase date with holdings, ordered by date, each holding the sum
     *         (not yet cumulative) for that date
     */
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