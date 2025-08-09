package com.stockbean.stockapp.dto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegistroRequest {

    private String nombre;
    private String apellido_paterno;
    private String apellido_materno;
    private String email;

    private String cuenta;
    private String password;
}
