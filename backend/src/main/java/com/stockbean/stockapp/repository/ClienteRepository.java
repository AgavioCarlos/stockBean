package com.stockbean.stockapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.stockbean.stockapp.model.tablas.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Integer>{
    
}
