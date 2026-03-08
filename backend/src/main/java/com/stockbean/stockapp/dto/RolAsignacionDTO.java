package com.stockbean.stockapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RolAsignacionDTO {
    private Integer idRol;
    private String nombre;
    private String descripcion;
    private Boolean asignado;
}
