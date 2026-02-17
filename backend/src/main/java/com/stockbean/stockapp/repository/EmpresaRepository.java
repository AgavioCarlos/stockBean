package com.stockbean.stockapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.stockbean.stockapp.dto.EmpresaUsuarioDTO;
import com.stockbean.stockapp.model.admin.Empresa;

public interface EmpresaRepository extends JpaRepository<Empresa, Integer> {

        @Query("""
                        SELECT new com.stockbean.stockapp.dto.EmpresaUsuarioDTO(
                                em.nombreComercial,
                                tu.cuenta,
                                CONCAT(tp.nombre, ' ', tp.apellido_paterno, ' ', tp.apellido_materno)
                        )
                        FROM EmpresaUsuario eu
                        INNER JOIN eu.empresa em
                        INNER JOIN eu.usuario tu
                        INNER JOIN tu.persona tp
                        WHERE em.idEmpresa = :idEmpresa
                        """)
        List<EmpresaUsuarioDTO> findEmpresasUsuariosId(@Param("idEmpresa") Integer idEmpresa);
}
