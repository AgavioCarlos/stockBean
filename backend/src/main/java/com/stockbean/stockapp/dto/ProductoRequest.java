package com.stockbean.stockapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductoRequest {
    private String nombre;
    private String descripcion;
    private Integer idCategoria;
    private Integer idUnidad;
    private Integer idMarca; 
    private String codigoBarras;
    private String imagenUrl;
    
}
