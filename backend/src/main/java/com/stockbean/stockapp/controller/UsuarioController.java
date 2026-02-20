package com.stockbean.stockapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stockbean.stockapp.model.tablas.Usuario;
import com.stockbean.stockapp.service.UsuarioService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.stockbean.stockapp.security.UsuarioPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PreAuthorize("hasAnyRole('SISTEM', 'ADMIN')")
    @GetMapping("/mis-usuarios")
    public ResponseEntity<List<Usuario>> listarUsuarios(@AuthenticationPrincipal UsuarioPrincipal principal) {
        return ResponseEntity.ok(usuarioService.listarUsuariosPorSolicitante(principal.getId()));
    }

    @PreAuthorize("hasAnyRole('SISTEM', 'ADMIN')")
    @PostMapping("/crear")
    public ResponseEntity<Usuario> crearUsuario(@RequestBody Usuario usuario,
            @AuthenticationPrincipal UsuarioPrincipal principal) {
        return ResponseEntity.ok(usuarioService.crearUsuario(usuario, principal.getId()));
    }
}
