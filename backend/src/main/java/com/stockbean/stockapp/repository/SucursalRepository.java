package com.stockbean.stockapp.repository;

import com.stockbean.stockapp.model.tablas.Sucursal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SucursalRepository extends JpaRepository<Sucursal, Integer> {
    // Basic CRUD operations are provided by JpaRepository
}
