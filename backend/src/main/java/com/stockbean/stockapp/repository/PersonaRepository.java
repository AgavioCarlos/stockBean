package com.stockbean.stockapp.repository;

import com.stockbean.stockapp.model.tablas.Persona;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PersonaRepository extends JpaRepository<Persona, Integer> {
    List<Persona> findByStatus(Boolean status);

    boolean existsByEmail(String email);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p FROM Persona p WHERE p.status = true AND (" +
            "p IN (SELECT pe.persona FROM PersonaEmpresa pe WHERE pe.empresa.idEmpresa = :idEmpresa AND pe.activo = true) OR "
            +
            "p IN (SELECT u.persona FROM EmpresaUsuario eu JOIN eu.usuario u WHERE eu.empresa.idEmpresa = :idEmpresa AND eu.activo = true AND u.status = true)"
            +
            ")")
    List<Persona> findByEmpresaId(@org.springframework.data.repository.query.Param("idEmpresa") Integer idEmpresa);
}
