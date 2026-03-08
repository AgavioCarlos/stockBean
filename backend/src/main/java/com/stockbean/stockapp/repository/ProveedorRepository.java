package com.stockbean.stockapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.stockbean.stockapp.model.tablas.Proveedor;

import org.springframework.data.repository.query.Param;

public interface ProveedorRepository extends JpaRepository<Proveedor, Integer> {
    List<Proveedor> findByStatus(Boolean status);

    @Query("SELECT p FROM Proveedor p WHERE p.idEmpresa IS NULL OR p.idEmpresa = :idEmpresa")
    List<Proveedor> findByIdEmpresaIsNullOrIdEmpresa(@Param("idEmpresa") Integer idEmpresa);
}
