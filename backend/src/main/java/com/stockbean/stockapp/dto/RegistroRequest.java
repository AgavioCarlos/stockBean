package com.stockbean.stockapp.dto;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegistroRequest {

    private String nombre;
    private String apellido_paterno;
    private String apellido_materno;
    private String email;
    private Boolean status;
    private LocalDateTime fecha_alta;
    private LocalDateTime fecha_ultima_modificacion;

    private String cuenta;
    private String password;
    
    private Integer id_rol;
}
