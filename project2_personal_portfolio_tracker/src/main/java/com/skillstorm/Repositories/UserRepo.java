package com.skillstorm.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skillstorm.Models.User;

public interface UserRepo extends JpaRepository<User, Integer> {

    boolean existsByUsername(String username);
    
}
