package com.skillstorm.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.skillstorm.DTOs.TopSecurityDto;
import com.skillstorm.Models.Security;
import com.skillstorm.Models.User;

@Repository
public interface SecurityRepo extends JpaRepository<Security, Integer> {

    long countByUser(User user);

    // Custom query to find the top 5 securities by total value for a given user
    @Query("""
            SELECT new com.skillstorm.DTOs.TopSecurityDto(h.security.id, h.security.name, SUM(h.shares * h.costPerShare))
            FROM Holding h
            WHERE h.account.user.id = :userId
            GROUP BY h.security.id, h.security.name
            ORDER BY SUM(h.shares * h.costPerShare) DESC
            LIMIT 5
            """)
    Iterable<TopSecurityDto> findTop5SecurityValues(int userId);

    Iterable<Security> findByUser_Id(int userId);

}