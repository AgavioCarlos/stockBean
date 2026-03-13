package com.stockbean.stockapp.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import com.stockbean.stockapp.model.tablas.UsuarioSucursal;
import com.stockbean.stockapp.model.tablas.Usuario;
import com.stockbean.stockapp.dto.UsuarioSucursalResponse;
import com.stockbean.stockapp.model.tablas.Sucursal;
import java.util.List;

@Repository
public interface UsuarioSucursalRepository extends JpaRepository<UsuarioSucursal, Integer> {

    List<UsuarioSucursal> findByStatusTrue();

    boolean existsByUsuarioAndSucursal(Usuario usuario, Sucursal sucursal);

    // Buscar todas las asignaciones de sucursales de un usuario (con datos del DTO)
    @Query("SELECT new com.stockbean.stockapp.dto.UsuarioSucursalResponse("
            + "us.idUsuarioSucursal, "
            + "us.usuario.id_usuario, "
            + "us.sucursal.id_sucursal, "
            + "us.sucursal.nombre, "
            + "us.sucursal.direccion, "
            + "us.status) "
            + "FROM UsuarioSucursal us WHERE us.usuario.id_usuario = :idUsuario")
    List<UsuarioSucursalResponse> findByUsuarioIdUsuario(@Param("idUsuario") Integer idUsuario);
}
