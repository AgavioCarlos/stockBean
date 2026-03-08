package com.stockbean.stockapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PantallaAsignacionDTO {
    private Integer idPantalla;
    private String nombre;
    private String ruta;
    private String moduloPadre;
    private Boolean asignado;
}
