package com.stockbean.stockapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;

import com.stockbean.stockapp.model.admin.PantallasPermisos;
import com.stockbean.stockapp.model.admin.PantallasPermisosId;

@Repository
public interface PantallasPermisosRepository extends JpaRepository<PantallasPermisos, PantallasPermisosId> {

    @Query("SELECT pp FROM PantallasPermisos pp JOIN FETCH pp.pantalla p JOIN FETCH pp.permiso per WHERE p.status = true")
    List<PantallasPermisos> findAllWithRelations();

    List<PantallasPermisos> findByPermiso_IdPermiso(Integer idPermiso);

    @Modifying
    @Query("DELETE FROM PantallasPermisos pp WHERE pp.permiso.idPermiso = :idPermiso")
    void deleteAllByPermisoId(@Param("idPermiso") Integer idPermiso);
}
