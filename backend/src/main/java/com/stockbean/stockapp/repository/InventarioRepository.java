package com.stockbean.stockapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.stockbean.stockapp.model.tablas.Inventario;

@Repository
public interface InventarioRepository extends JpaRepository<Inventario, Integer> {

}
