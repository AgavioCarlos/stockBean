package com.stockbean.stockapp.repository;

import com.stockbean.stockapp.model.catalogos.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RolRepository extends JpaRepository<Rol, Integer> {
    
}