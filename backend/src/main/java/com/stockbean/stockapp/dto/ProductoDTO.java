package com.stockbean.stockapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductoDTO {
    private Integer id_producto;
    private String nombre;
    private String descripcion;
    private String codigoBarras;
    private String imagenUrl;
    private Boolean status;
    private LocalDateTime fechaAlta;
    private LocalDateTime fechaUltimaModificacion;
    
    // Simplificamos los objetos relacionados
    private CategoriaMiniDTO categoria;
    private UnidadMiniDTO unidad;
    private MarcaMiniDTO marca;
    private Integer idEmpresa;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CategoriaMiniDTO {
        private Integer idCategoria;
        private String nombre;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UnidadMiniDTO {
        private Integer idUnidad;
        private String nombre;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MarcaMiniDTO {
        private Integer idMarca;
        private String nombre;
    }
}
