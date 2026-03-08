package com.stockbean.stockapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.stockbean.stockapp.model.tablas.RolPermisos;

@Repository
public interface RolPermisosRepository extends JpaRepository<RolPermisos, Integer> {

    @Query("SELECT rp FROM RolPermisos rp WHERE rp.rol.id_rol = :idRol AND rp.fechaBaja IS NULL")
    List<RolPermisos> findByRolIdAndFechaBajaIsNull(@Param("idRol") Integer idRol);

    @Modifying
    @Query("DELETE FROM RolPermisos rp WHERE rp.rol.id_rol = :idRol")
    void deleteAllByRolId(@Param("idRol") Integer idRol);

    @Query("SELECT rp FROM RolPermisos rp WHERE rp.permiso.idPermiso = :idPermiso AND rp.fechaBaja IS NULL")
    List<RolPermisos> findByPermisoIdAndFechaBajaIsNull(@Param("idPermiso") Integer idPermiso);

    @Modifying
    @Query("DELETE FROM RolPermisos rp WHERE rp.permiso.idPermiso = :idPermiso")
    void deleteAllByPermisoId(@Param("idPermiso") Integer idPermiso);
}
