package com.stockbean.stockapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.stockbean.stockapp.model.tablas.TurnoCaja;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;

@Repository
public interface TurnoCajaRepository extends JpaRepository<TurnoCaja, Integer> {

    // Obtener turno abierto para el usuario
    TurnoCaja findByIdUsuarioAndEstado(Integer idUsuario, String estado);

    @Query(value = "SELECT fn_cerrar_turno_caja(:p_id_turno, :p_monto_real)", nativeQuery = true)
    Object cerrarTurno(@Param("p_id_turno") Integer pIdTurno, @Param("p_monto_real") BigDecimal pMontoReal);
}
