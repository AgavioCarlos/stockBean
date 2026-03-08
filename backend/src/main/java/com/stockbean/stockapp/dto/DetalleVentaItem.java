package com.stockbean.stockapp.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetalleVentaItem {
    private Integer idProducto;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal descuento;
    private BigDecimal subtotal;
}
