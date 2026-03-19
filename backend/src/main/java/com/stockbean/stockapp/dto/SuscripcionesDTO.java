package com.stockbean.stockapp.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SuscripcionesDTO {
    private Integer idEmpresa;
    private Integer idUsuario;
    private String usuario;
    private Integer idPersona;
    private String nombre;
    private String apellidoPaterno;
    private String apellidoMaterno;
    private Integer idPlan;
    private String plan;
    private Boolean status;
    private Integer idSuscripcion;
    private LocalDateTime fechaFin;
}
