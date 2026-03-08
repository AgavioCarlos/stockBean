package com.stockbean.stockapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.stockbean.stockapp.model.tablas.DetalleVenta;

@Repository
public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Integer> {

    @Query("SELECT d FROM DetalleVenta d " +
            "JOIN FETCH d.producto " +
            "WHERE d.venta.idVenta = :idVenta")
    List<DetalleVenta> findByVentaId(@Param("idVenta") Integer idVenta);

    @Query("SELECT d FROM DetalleVenta d " +
            "JOIN FETCH d.producto " +
            "WHERE d.venta.idVenta IN :ventaIds")
    List<DetalleVenta> findByVentaIds(@Param("ventaIds") List<Integer> ventaIds);
}
