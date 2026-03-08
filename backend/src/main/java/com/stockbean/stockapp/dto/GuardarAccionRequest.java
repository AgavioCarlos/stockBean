package com.stockbean.stockapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Payload enviado desde el frontend al guardar la matriz de permisos.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GuardarAccionRequest {
    private Integer idPantalla;
    private Integer idAccion;
    private Boolean permitido;
}
