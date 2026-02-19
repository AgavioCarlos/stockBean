package com.stockbean.stockapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.stockbean.stockapp.dto.EmpresaUsuarioDTO;
import com.stockbean.stockapp.model.admin.Empresa;
import com.stockbean.stockapp.model.admin.EmpresaUsuario;
import com.stockbean.stockapp.model.tablas.Usuario;

@Repository
public interface EmpresaUsuarioRepository extends JpaRepository<EmpresaUsuario, Integer> {

    List<EmpresaUsuario> findByUsuario(Usuario usuario);

    List<EmpresaUsuario> findByEmpresa(Empresa empresa);

    @Query("""
            SELECT new com.stockbean.stockapp.dto.EmpresaUsuarioDTO(
                            em.nombreComercial,
                            us.cuenta,
                            CONCAT(pe.nombre, ' ', pe.apellido_paterno, ' ', pe.apellido_materno)
            )
            FROM EmpresaUsuario eu
            INNER JOIN eu.usuario us
            INNER JOIN us.persona pe
            INNER JOIN eu.empresa em
            WHERE eu.usuario.id_usuario = :id_usuario
            """)

    List<EmpresaUsuarioDTO> validarEmpresaUsuario(@Param("id_usuario") Integer id_usuario);

    @Query("SELECT DISTINCT eu.empresa.idEmpresa FROM EmpresaUsuario eu WHERE eu.usuario.id_usuario = :idUsuario AND eu.activo = true")
    List<Integer> findIdEmpresaByUsuarioId(@Param("idUsuario") Integer idUsuario);
}
