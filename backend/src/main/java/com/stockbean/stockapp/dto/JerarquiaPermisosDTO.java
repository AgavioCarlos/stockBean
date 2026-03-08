package com.stockbean.stockapp.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JerarquiaPermisosDTO {
    private Integer idPantalla;
    private String nombrePantalla;
    private String ruta;
    private String clave;
    private String icono;
    private List<PermisoDetalleDTO> permisos;
}
