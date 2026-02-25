package com.stockbean.stockapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.stockbean.stockapp.model.tablas.ProductoEmpresa;
import java.util.List;

@Repository
public interface ProductoEmpresaRepository extends JpaRepository<ProductoEmpresa, Integer> {
    List<ProductoEmpresa> findByEmpresaIdEmpresa(Integer idEmpresa);
}
