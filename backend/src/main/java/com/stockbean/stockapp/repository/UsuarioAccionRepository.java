package com.stockbean.stockapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.stockbean.stockapp.model.admin.UsuarioAccion;

@Repository
public interface UsuarioAccionRepository extends JpaRepository<UsuarioAccion, Integer> {

    // Extraer todos los micro-permisos activos de un Empleado en una Empresa
    // específica
    @Query("SELECT ua FROM UsuarioAccion ua JOIN FETCH ua.pantalla p JOIN FETCH ua.accion a " +
            "WHERE ua.usuario.id_usuario = :id_usuario AND ua.empresa.idEmpresa = :idEmpresa AND ua.status = true AND ua.permitido = true")
    List<UsuarioAccion> buscarPermisosActivosPorUsuarioYEmpresa(
            @Param("id_usuario") Integer idUsuario,
            @Param("idEmpresa") Integer idEmpresa);

    // Buscar un permiso específico para evitar duplicados
    @Query("SELECT ua FROM UsuarioAccion ua WHERE ua.usuario.id_usuario = :id_usuario AND ua.empresa.idEmpresa = :idEmpresa AND ua.pantalla.idPantalla = :idPantalla AND ua.accion.idAccion = :idAccion")
    java.util.Optional<UsuarioAccion> buscarPermisoExacto(
            @Param("id_usuario") Integer idUsuario,
            @Param("idEmpresa") Integer idEmpresa,
            @Param("idPantalla") Integer idPantalla,
            @Param("idAccion") Integer idAccion);

    // Eliminar todos los permisos de un usuario en una empresa (para rebuild)
    @org.springframework.data.jpa.repository.Modifying
    @Query("DELETE FROM UsuarioAccion ua WHERE ua.usuario.id_usuario = :idUsuario AND ua.empresa.idEmpresa = :idEmpresa")
    void eliminarPermisosPorUsuarioYEmpresa(@Param("idUsuario") Integer idUsuario,
            @Param("idEmpresa") Integer idEmpresa);

}
