package com.stockbean.stockapp.repository;

import com.stockbean.stockapp.model.tablas.Persona;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PersonaRepository extends JpaRepository<Persona, Integer> {
    List<Persona> findByStatus(Boolean status);

    boolean existsByEmail(String email);

    @org.springframework.data.jpa.repository.Query("SELECT p FROM EmpresaUsuario eu JOIN eu.usuario u JOIN u.persona p WHERE eu.empresa.idEmpresa = :idEmpresa")
    List<Persona> findByEmpresaId(@org.springframework.data.repository.query.Param("idEmpresa") Integer idEmpresa);
}
