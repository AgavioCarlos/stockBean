package com.stockbean.stockapp.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VentaReporteDTO {
    private Integer idVenta;
    private LocalDateTime fechaVenta;
    private String sucursal;
    private Integer idSucursal;
    private String cajero;
    private String metodoPago;
    private Integer totalProductos;
    private BigDecimal totalVenta;
    private Integer cantidadItems;
}
