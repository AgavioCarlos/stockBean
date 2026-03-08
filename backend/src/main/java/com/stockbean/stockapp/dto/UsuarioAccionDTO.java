package com.stockbean.stockapp.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Representa una fila de la matriz de permisos:
 * Una pantalla con sus acciones marcadas para un usuario.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioAccionDTO {
    private Integer idPantalla;
    private String pantallaNombre;
    private String pantallaClave;
    private List<AccionItemDTO> acciones;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AccionItemDTO {
        private Integer idAccion;
        private String nombre;
        private Boolean permitido;
    }
}
