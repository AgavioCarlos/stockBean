package com.stockbean.stockapp.dto;

import java.math.BigDecimal;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VentasPorDiaDTO {
    private String fecha;
    private String topProducto;
    private Integer cantidad; // Cantidad total de productos vendidos ese día
    private BigDecimal totalVentas; // Monto total de ventas ese día
}
