package com.stockbean.stockapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.stockbean.stockapp.model.tablas.Suscripcion;
import com.stockbean.stockapp.model.tablas.Usuario;
import com.stockbean.stockapp.dto.SuscripcionAdminDTO;

import org.springframework.data.jpa.repository.Query;
import java.util.List;

@Repository
public interface SuscripcionRepository extends JpaRepository<Suscripcion, Integer> {
    Suscripcion findTopByUsuarioOrderByFechaInicioDesc(Usuario usuario);

    @Query("SELECT new com.stockbean.stockapp.dto.SuscripcionAdminDTO(s.idSuscripcion, e.idEmpresa, e.razonSocial, e.nombreComercial, p.nombre, s.fechaInicio, s.fechaFin, s.status) "
            +
            "FROM Suscripcion s " +
            "JOIN s.plan p " +
            "JOIN s.usuario u " +
            "JOIN EmpresaUsuario eu ON eu.usuario = u " +
            "JOIN eu.empresa e " +
            "WHERE eu.activo = true " +
            "ORDER BY s.fechaFin DESC")
    List<SuscripcionAdminDTO> findAllAdminSuscripciones();
}
