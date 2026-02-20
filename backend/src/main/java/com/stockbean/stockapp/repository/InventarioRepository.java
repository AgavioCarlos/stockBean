package com.stockbean.stockapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.stockbean.stockapp.model.tablas.Inventario;

@Repository
public interface InventarioRepository extends JpaRepository<Inventario, Integer> {

    @Query("SELECT i FROM Inventario i " +
            "JOIN FETCH i.producto " +
            "JOIN FETCH i.sucursal " +
            "WHERE i.sucursal.id_sucursal = :idSucursal " +
            "AND i.status = true")
    List<Inventario> findBySucursalIdAndStatusTrue(@Param("idSucursal") Integer idSucursal);
}
