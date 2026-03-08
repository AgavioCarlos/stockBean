package com.stockbean.stockapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.stockbean.stockapp.model.tablas.Venta;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Integer> {

    @Query("SELECT v FROM Venta v WHERE v.idSucursal = :idSucursal ORDER BY v.fechaVenta DESC")
    List<Venta> findBySucursalId(@Param("idSucursal") Integer idSucursal);

    // Ventas de múltiples sucursales (para reportes de ADMIN)
    @Query("SELECT v FROM Venta v LEFT JOIN FETCH v.metodoPago " +
            "WHERE v.idSucursal IN :idsSucursales ORDER BY v.fechaVenta DESC")
    List<Venta> findBySucursalIds(@Param("idsSucursales") List<Integer> idsSucursales);

    // Todas las ventas (SISTEM)
    @Query("SELECT v FROM Venta v LEFT JOIN FETCH v.metodoPago ORDER BY v.fechaVenta DESC")
    List<Venta> findAllWithMetodoPago();

    // Contar items de detalle por venta
    @Query("SELECT COUNT(d) FROM DetalleVenta d WHERE d.venta.idVenta = :idVenta")
    Long countDetallesByVentaId(@Param("idVenta") Integer idVenta);

    // Suma de cantidades de detalle por venta
    @Query("SELECT COALESCE(SUM(d.cantidad), 0) FROM DetalleVenta d WHERE d.venta.idVenta = :idVenta")
    Long sumCantidadByVentaId(@Param("idVenta") Integer idVenta);

    // Dashboard: Ventas en un rango de fechas para todas las sucursales (SISTEM)
    @Query("SELECT v FROM Venta v WHERE v.fechaVenta BETWEEN :inicio AND :fin")
    List<Venta> findByFechaVentaBetween(@Param("inicio") java.time.LocalDateTime inicio,
            @Param("fin") java.time.LocalDateTime fin);

    // Dashboard: Ventas en un rango de fechas para sucursales específicas
    // (ADMIN/GERENTE)
    @Query("SELECT v FROM Venta v WHERE v.idSucursal IN :idsSucursales AND v.fechaVenta BETWEEN :inicio AND :fin")
    List<Venta> findBySucursalIdsAndFechaVentaBetween(
            @Param("idsSucursales") List<Integer> idsSucursales,
            @Param("inicio") java.time.LocalDateTime inicio,
            @Param("fin") java.time.LocalDateTime fin);
}
