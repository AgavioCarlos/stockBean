package com.stockbean.stockapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PermisoDetalleDTO {
    private Integer idPermiso;
    private String nombre;
    private Boolean asignado;
}
