package com.stockbean.stockapp.dto;

import java.math.BigDecimal;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsDTO {
    // Monto Ventas
    private BigDecimal montoHoy;
    private String trendMonto;
    private String montoColor;

    // Total Ventas (Conteo)
    private Long conteoHoy;
    private String trendConteo;
    private String conteoColor;

    // Productos Vendidos
    private Long unidadesHoy;
    private String trendUnidades;
    private String unidadesColor;

    // Promedio/Venta
    private BigDecimal promedioHoy;
    private String trendPromedio;
    private String promedioColor;
}
