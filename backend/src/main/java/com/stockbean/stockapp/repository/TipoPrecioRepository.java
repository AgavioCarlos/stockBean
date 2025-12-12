package com.stockbean.stockapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.stockbean.stockapp.model.catalogos.TipoPrecio;

public interface TipoPrecioRepository extends JpaRepository<TipoPrecio, Integer> {
    
}
