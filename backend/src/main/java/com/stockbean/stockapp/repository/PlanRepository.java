package com.stockbean.stockapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.stockbean.stockapp.model.catalogos.Plan;

public interface PlanRepository extends JpaRepository<Plan, Integer>{
}
