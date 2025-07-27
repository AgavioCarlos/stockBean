package com.stockbean.stockapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.stockbean.stockapp.model.catalogos.Unidad;

public interface UnidadRepository extends JpaRepository<Unidad, Integer> {
    
    
}   
