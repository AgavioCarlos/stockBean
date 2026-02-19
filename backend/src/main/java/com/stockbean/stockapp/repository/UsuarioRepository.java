package com.stockbean.stockapp.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.stockbean.stockapp.model.tablas.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    Optional<Usuario> findByCuenta(String cuenta);

    @Query("SELECT u FROM Usuario u, EmpresaUsuario eu WHERE u.id_usuario = eu.usuario.id_usuario AND eu.empresa.idEmpresa = :idEmpresa")
    java.util.List<Usuario> findByEmpresaId(@Param("idEmpresa") Integer idEmpresa);

}
