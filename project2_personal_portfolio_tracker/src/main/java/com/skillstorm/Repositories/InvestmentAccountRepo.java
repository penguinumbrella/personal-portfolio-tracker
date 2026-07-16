package com.skillstorm.Repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.skillstorm.DTOs.AccountTypeBreakdownDto;
import com.skillstorm.Models.InvestmentAccount;
import com.skillstorm.Models.User;

public interface InvestmentAccountRepo extends JpaRepository<InvestmentAccount, Integer> {

    List<InvestmentAccount> findByUserId(Long userId);

    Page<InvestmentAccount> findByUserIdAndNicknameContainingIgnoreCase(Long userId, String search, Pageable pageable);

    boolean existsByNickname(String nickname);

    long countByUser(User user);

    List<InvestmentAccount> findTop5ByUserIdOrderByDateOpenedDesc(Long userId);

    // Count of a user's investment accounts grouped by account type, for the type-breakdown pie chart
    @Query("""
            SELECT new com.skillstorm.DTOs.AccountTypeBreakdownDto(a.accountType, COUNT(a))
            FROM InvestmentAccount a
            WHERE a.user.id = :userId
            GROUP BY a.accountType
            """)
    Iterable<AccountTypeBreakdownDto> countByAccountTypeForUser(int userId);

}
