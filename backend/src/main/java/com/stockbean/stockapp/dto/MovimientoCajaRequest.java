package com.stockbean.stockapp.dto;

import lombok.Data;

@Data
public class MovimientoCajaRequest {
    private Integer idTurno;
    private String tipoMovimiento; // ENTRADA, RETIRO
    private String concepto; // ej: "Cambio" o "Pago de refacciones"
    private Double monto;
}
