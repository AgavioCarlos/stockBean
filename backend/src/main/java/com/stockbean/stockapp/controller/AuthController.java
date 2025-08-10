package com.stockbean.stockapp.controller;

import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stockbean.stockapp.dto.LoginRequest;
import com.stockbean.stockapp.dto.LoginResponse;
import com.stockbean.stockapp.dto.RegistroRequest;
import com.stockbean.stockapp.service.LoginService;
import com.stockbean.stockapp.service.RegistroService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private RegistroService registroService;

    @Autowired 
    private LoginService loginService;

    @PostMapping("/registro")
    public ResponseEntity<Map<String, String>>registrar(@RequestBody RegistroRequest request) {
    registroService.registrar(request);
    Map<String, String> respuesta = new HashMap<>();
    respuesta.put("mensaje", "Registro exitoso");
        return ResponseEntity.ok(respuesta);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request){
        System.out.println("Cuenta/email recibida: " + request.getCuenta());
        LoginResponse respuesta = loginService.login(request);
        return ResponseEntity.ok(respuesta);
    }
    
}
