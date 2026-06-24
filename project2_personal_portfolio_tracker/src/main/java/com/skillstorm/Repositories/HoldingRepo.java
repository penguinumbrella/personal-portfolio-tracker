package com.skillstorm.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.skillstorm.Models.Holding;
import com.skillstorm.Models.HoldingPK;

@Repository
public interface HoldingRepo extends JpaRepository<Holding, HoldingPK> {

}