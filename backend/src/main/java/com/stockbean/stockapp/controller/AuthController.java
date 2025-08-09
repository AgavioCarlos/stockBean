package com.stockbean.stockapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stockbean.stockapp.dto.RegistroRequest;
import com.stockbean.stockapp.service.RegistroService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private RegistroService registroService;

    @PostMapping("/registro")
    public ResponseEntity<String> registrar(@RequestBody RegistroRequest request) {
        String resultado = registroService.registrar(request);
        return ResponseEntity.ok(resultado);
    }
    
}
