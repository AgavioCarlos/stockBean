package com.stockbean.stockapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PantallaDTO {
    Integer idPantalla;
    String clave;
    String nombre;
    String ruta;
    String icono;
    Integer orden;
    Integer idPadre;
    Boolean esMenu;
}
