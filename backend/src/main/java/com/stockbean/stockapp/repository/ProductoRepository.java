package com.stockbean.stockapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.stockbean.stockapp.model.tablas.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Integer> {
    List<Producto> findByStatus(Boolean status);

    // Obtener los producto de la empresa a la que pertenece el usuario
    // @Query("SELECT pe.producto FROM ProductoEmpresa pe JOIN EmpresaUsuario eu ON
    // pe.empresa = eu.empresa WHERE eu.usuario.id_usuario = :idUsuario")
    // List<Producto> findByUsuarioId(@Param("idUsuario") Integer idUsuario);

    // @Query("SELECT p FROM Producto p JOIN p.productoEmpresa pe JOIN pe.empresa e
    // JOIN e.usuarios u WHERE u.idUsuario = :idUsuario")
    // List<Producto> findByUsuarioId(@Param("idUsuario") Integer idUsuario);

    // SELECT NOMBRE, DESCRIPCION, CODIGO_BARRAS FROM TBL_PRODUCTOS
    // WHERE ID_PRODUCTO IN
    // (SELECT
    // ID_PRODUCTO
    // FROM
    // TBL_INVENTARIO IV
    // JOIN TBL_USUARIO_SUCURSALES US ON IV.ID_SUCURSAL = US.ID_SUCURSAL
    // JOIN ADMIN_EMPRESA_USUARIO ES ON US.ID_USUARIO = ES.ID_USUARIO
    // JOIN ADMIN_EMPRESAS EM ON ES.ID_EMPRESA = EM.ID_EMPRESA
    // WHERE
    // EM.ID_EMPRESA = 2
    // AND IV.STATUS IS TRUE)

    @Query("SELECT p FROM Producto p JOIN EmpresaUsuario eu ON p.empresa.idEmpresa = eu.empresa.idEmpresa WHERE eu.usuario.id_usuario = :idUsuario AND eu.activo = true")
    List<Producto> findByUsuarioId(@Param("idUsuario") Integer idUsuario);
}