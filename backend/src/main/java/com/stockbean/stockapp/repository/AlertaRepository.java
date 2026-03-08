package com.stockbean.stockapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.stockbean.stockapp.model.tablas.Alerta;

@Repository
public interface AlertaRepository extends JpaRepository<Alerta, Integer> {

    // Alertas activas de una sucursal específica (GERENTE/CAJERO)
    @Query("SELECT a FROM Alerta a " +
            "JOIN FETCH a.producto " +
            "JOIN FETCH a.sucursal " +
            "JOIN FETCH a.tipoAlerta " +
            "WHERE a.sucursal.id_sucursal = :idSucursal " +
            "AND a.status = true " +
            "ORDER BY a.fecha DESC")
    List<Alerta> findBySucursalAndStatusTrue(@Param("idSucursal") Integer idSucursal);

    // Alertas activas de varias sucursales (ADMIN -> sucursales de su empresa)
    @Query("SELECT a FROM Alerta a " +
            "JOIN FETCH a.producto " +
            "JOIN FETCH a.sucursal " +
            "JOIN FETCH a.tipoAlerta " +
            "WHERE a.sucursal.id_sucursal IN :idsSucursales " +
            "AND a.status = true " +
            "ORDER BY a.fecha DESC")
    List<Alerta> findBySucursalesAndStatusTrue(@Param("idsSucursales") List<Integer> idsSucursales);

    // Todas las alertas activas (SISTEM)
    @Query("SELECT a FROM Alerta a " +
            "JOIN FETCH a.producto " +
            "JOIN FETCH a.sucursal " +
            "JOIN FETCH a.tipoAlerta " +
            "WHERE a.status = true " +
            "ORDER BY a.fecha DESC")
    List<Alerta> findAllActiveAlertas();

    // Contar alertas activas por sucursal
    @Query("SELECT COUNT(a) FROM Alerta a " +
            "WHERE a.sucursal.id_sucursal = :idSucursal " +
            "AND a.status = true")
    Long countBySucursalAndStatusTrue(@Param("idSucursal") Integer idSucursal);

    // Contar alertas activas de varias sucursales
    @Query("SELECT COUNT(a) FROM Alerta a " +
            "WHERE a.sucursal.id_sucursal IN :idsSucursales " +
            "AND a.status = true")
    Long countBySucursalesAndStatusTrue(@Param("idsSucursales") List<Integer> idsSucursales);

    // Marcar alerta como leída (status = false)
    @Modifying
    @Query("UPDATE Alerta a SET a.status = false, a.fechaUltimaModificacion = CURRENT_TIMESTAMP WHERE a.idAlerta = :idAlerta")
    void marcarComoLeida(@Param("idAlerta") Integer idAlerta);

    // Marcar todas las alertas de una sucursal como leídas
    @Modifying
    @Query("UPDATE Alerta a SET a.status = false, a.fechaUltimaModificacion = CURRENT_TIMESTAMP " +
            "WHERE a.sucursal.id_sucursal IN :idsSucursales AND a.status = true")
    void marcarTodasComoLeidas(@Param("idsSucursales") List<Integer> idsSucursales);
}
