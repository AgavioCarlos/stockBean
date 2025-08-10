package com.stockbean.stockapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.stockbean.stockapp.dto.LoginRequest;
import com.stockbean.stockapp.dto.LoginResponse;
import com.stockbean.stockapp.repository.UsuarioRepository;

@Service
public class LoginService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest request) {
    if(request.getCuenta() == null || request.getCuenta().isEmpty()) {
        return new LoginResponse(false, "Cuenta vacía");
    }

    return usuarioRepository.findByCuenta(request.getCuenta())
        .map(usuario -> {
            if (passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
                return new LoginResponse(true, "Login exitoso");
            } else {
                return new LoginResponse(false, "Contraseña incorrecta");
            }
        })
        .orElse(new LoginResponse(false, "Usuario no encontrado"));
}
}
