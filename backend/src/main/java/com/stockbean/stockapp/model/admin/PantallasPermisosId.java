package com.stockbean.stockapp.model.admin;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class PantallasPermisosId implements Serializable {
    @Column(name = "id_pantalla")
    private Integer idPantalla;

    @Column(name = "id_permiso")
    private Integer idPermiso;
}
