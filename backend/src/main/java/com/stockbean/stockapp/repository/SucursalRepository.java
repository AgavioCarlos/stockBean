package com.stockbean.stockapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.stockbean.stockapp.model.tablas.Sucursal;

@Repository
public interface SucursalRepository extends JpaRepository<Sucursal, Integer> {

        @Query("SELECT DISTINCT us.sucursal FROM UsuarioSucursal us, EmpresaUsuario eu " +
                        "WHERE us.usuario = eu.usuario " +
                        "AND eu.empresa.idEmpresa = :idEmpresa " +
                        "AND us.sucursal.status = true " +
                        "AND us.status = true " +
                        "AND eu.activo = true")
        List<Sucursal> findByEmpresaId(@Param("idEmpresa") Integer idEmpresa);
}
