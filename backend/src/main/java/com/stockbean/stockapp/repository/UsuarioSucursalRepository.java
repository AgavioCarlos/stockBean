package com.stockbean.stockapp.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.stockbean.stockapp.model.tablas.UsuarioSucursal;
import com.stockbean.stockapp.model.tablas.Usuario;
import com.stockbean.stockapp.dto.UsuarioSucursalResponse;
import com.stockbean.stockapp.model.tablas.Sucursal;
import java.util.List;

@Repository
public interface UsuarioSucursalRepository extends JpaRepository<UsuarioSucursal, Integer> {

    List<UsuarioSucursal> findByStatusTrue();

    boolean existsByUsuarioAndSucursal(Usuario usuario, Sucursal sucursal);

    @Query("SELECT new com.stockbean.stockapp.dto.UsuarioSucursalResponse("
            + "us.idUsuarioSucursal, "
            + "us.usuario.id_usuario, "
            + "us.sucursal.idSucursal, "
            + "us.sucursal.nombre, "
            + "us.sucursal.direccion, "
            + "us.status) "
            + "FROM UsuarioSucursal us where us.usuario.id_usuario = :idUsuario")
    List<UsuarioSucursalResponse> findByUsuarioIdUsuario(@Param("idUsuario") Integer idUsuario);
}
