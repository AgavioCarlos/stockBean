package com.stockbean.stockapp.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para devolver la información del producto al punto de venta.
 * Incluye datos del producto, precio de venta actual y stock disponible.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoBusquedaDTO {
    private Integer idProducto;
    private String nombre;
    private String descripcion;
    private String codigoBarras;
    private String unidad;
    private String marca;
    private String categoria;
    private String imagenUrl;
    private BigDecimal precioVenta;
    private Integer stockDisponible;
    private Integer stockMinimo;
}
