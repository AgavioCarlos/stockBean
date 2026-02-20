package com.stockbean.stockapp.model.admin;

import com.stockbean.stockapp.model.catalogos.Permiso;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "admin_pantallas_permisos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PantallasPermisos {

    @EmbeddedId
    private PantallasPermisosId id;

    @ManyToOne
    @MapsId("idPantalla")
    @JoinColumn(name = "id_pantalla")
    private Pantallas pantalla;

    @ManyToOne
    @MapsId("idPermiso")
    @JoinColumn(name = "id_permiso")
    private Permiso permiso;

    @Column(name = "status")
    private Boolean status;
}
