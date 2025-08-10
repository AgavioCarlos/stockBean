package com.stockbean.stockapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {
    private Boolean success;
    private String mensaje;

    public LoginResponse(Boolean success, String mensaje) {
        this.success = success;
        this.mensaje = mensaje;
    }
    
}
