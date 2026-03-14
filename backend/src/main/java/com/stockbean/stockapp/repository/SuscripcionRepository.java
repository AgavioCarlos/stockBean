package com.stockbean.stockapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.stockbean.stockapp.model.tablas.Suscripcion;
import com.stockbean.stockapp.model.tablas.Usuario;
import com.stockbean.stockapp.dto.SuscripcionAdminDTO;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface SuscripcionRepository extends JpaRepository<Suscripcion, Integer> {
    Suscripcion findTopByUsuarioOrderByFechaInicioDesc(Usuario usuario);

    Suscripcion findTopByEmpresa_IdEmpresaOrderByFechaInicioDesc(Integer idEmpresa);

    @Query("SELECT new com.stockbean.stockapp.dto.SuscripcionAdminDTO(s.idSuscripcion, u.id_usuario, CONCAT(per.nombre, ' ', per.apellido_paterno), per.email, e.idEmpresa, e.nombreComercial, p.nombre, s.fechaInicio, s.fechaFin, s.status) "
            +
            "FROM Suscripcion s " +
            "LEFT JOIN s.plan p " +
            "LEFT JOIN s.usuario u " +
            "LEFT JOIN u.persona per " +
            "LEFT JOIN EmpresaUsuario eu ON eu.usuario = u AND eu.activo = true " +
            "LEFT JOIN eu.empresa e " +
            "ORDER BY s.fechaFin DESC")
    List<SuscripcionAdminDTO> findAllAdminSuscripciones();

    @Query("SELECT new com.stockbean.stockapp.dto.SuscripcionAdminDTO(s.idSuscripcion, u.id_usuario, CONCAT(per.nombre, ' ', per.apellido_paterno), per.email, e.idEmpresa, e.nombreComercial, p.nombre, s.fechaInicio, s.fechaFin, s.status) "
            +
            "FROM Suscripcion s " +
            "LEFT JOIN s.plan p " +
            "LEFT JOIN s.usuario u " +
            "LEFT JOIN u.persona per " +
            "LEFT JOIN EmpresaUsuario eu ON eu.usuario = u AND eu.activo = true " +
            "LEFT JOIN eu.empresa e " +
            "WHERE eu.empresa.idEmpresa = :idEmpresa " +
            "ORDER BY s.fechaFin DESC")
    List<SuscripcionAdminDTO> findByEmpresaId(@Param("idEmpresa") Integer idEmpresa);
}
