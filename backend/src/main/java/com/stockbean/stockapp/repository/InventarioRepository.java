package com.stockbean.stockapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.stockbean.stockapp.model.tablas.Inventario;

@Repository
public interface InventarioRepository extends JpaRepository<Inventario, Integer> {

    @org.springframework.data.jpa.repository.Query("SELECT i FROM Inventario i WHERE i.sucursal.id_sucursal = :idSucursal AND i.status = true")
    java.util.List<Inventario> findBySucursalIdAndStatusTrue(
            @org.springframework.data.repository.query.Param("idSucursal") Integer idSucursal);
}
