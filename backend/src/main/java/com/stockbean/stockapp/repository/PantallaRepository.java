package com.stockbean.stockapp.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.stockbean.stockapp.dto.PantallaDTO;
import com.stockbean.stockapp.model.admin.Pantallas;

public interface PantallaRepository extends JpaRepository<Pantallas, Integer> {
    @Query("""
            SELECT new com.stockbean.stockapp.dto.PantallaDTO(
                pt.idPantalla,
                pt.clave,
                pt.nombre,
                pt.ruta,
                pt.icono,
                pt.orden,
                pt.idPadre,
                pt.esMenu
            )
            FROM RolPermisos rp
            INNER JOIN PantallasPermisos pp ON pp.permiso.idPermiso = rp.permiso.idPermiso
            INNER JOIN pp.pantalla pt
            WHERE rp.rol.id_rol = :idRol AND pp.status = true
            """)
    List<PantallaDTO> findByIdPantalla(@Param("idRol") Integer idRol);

}
