package com.skillstorm.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.skillstorm.Models.Security;
import com.skillstorm.Models.User;

@Repository
public interface SecurityRepo extends JpaRepository<Security, Integer> {

    long countByUser(User user);

    //List<Security> findTop5ByUserIdDesc(Long userId);

    //List<Security> findTop5ByUserIdOrderByDateOpenedDesc(Long userId); // maybe change this?

    List<Security> findTop5ByUser_IdOrderByIdDesc(Long userId);

    Iterable<Security> findByUser_Id(int userId);

}