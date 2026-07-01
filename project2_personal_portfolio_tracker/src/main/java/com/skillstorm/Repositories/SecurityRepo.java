package com.skillstorm.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.skillstorm.Models.Security;
import com.skillstorm.Models.User;

@Repository
public interface SecurityRepo extends JpaRepository<Security, Integer> {

    long countByUser(User user);

    //List<Security> findTop5ByUserIdDesc(Long userId);

    //List<Security> findTop5ByUserIdOrderByDateOpenedDesc(Long userId); // maybe change this?

    Iterable<Security> findByUser_Id(int userId);

}