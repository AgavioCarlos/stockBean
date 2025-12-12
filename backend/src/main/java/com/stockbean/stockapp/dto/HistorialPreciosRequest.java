package com.stockbean.stockapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HistorialPreciosRequest {
    private Integer idProducto;
    private Double precioAnterior;
    private Double precioNuevo;
    private String fechaCambio;
    private Integer idUsuario;

}
