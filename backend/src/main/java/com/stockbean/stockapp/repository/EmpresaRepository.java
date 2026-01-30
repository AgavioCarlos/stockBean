package com.stockbean.stockapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.stockbean.stockapp.model.admin.Empresa;

public interface EmpresaRepository extends JpaRepository<Empresa, Integer>{
    
}
