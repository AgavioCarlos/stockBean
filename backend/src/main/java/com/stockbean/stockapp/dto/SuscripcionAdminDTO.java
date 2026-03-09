package com.stockbean.stockapp.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SuscripcionAdminDTO {
    private Integer idSuscripcion;
    private Integer idUsuario;
    private String nombreCompleto;
    private String email;
    private Integer idEmpresa;
    private String nombreEmpresa;
    private String planNombre;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private Boolean statusSuscripcion;
}
