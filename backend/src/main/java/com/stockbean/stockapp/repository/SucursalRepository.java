package com.stockbean.stockapp.repository;

import com.stockbean.stockapp.model.catalogos.Sucursales;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SucursalRepository extends JpaRepository<Sucursales, Integer> {
    // Basic CRUD operations are provided by JpaRepository
}
