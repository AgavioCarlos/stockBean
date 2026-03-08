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

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @PreAuthorize("hasAnyRole('SISTEM', 'ADMIN')")
    @GetMapping("/mis-usuarios")
    public ResponseEntity<List<Usuario>> listarUsuarios(@AuthenticationPrincipal UsuarioPrincipal principal) {
        return ResponseEntity.ok(usuarioService.listarUsuariosPorSolicitante(principal.getId()));
    }

    @PreAuthorize("hasAnyRole('SISTEM', 'ADMIN')")
    @PostMapping("/crear")
    public ResponseEntity<Usuario> crearUsuario(@RequestBody Usuario usuario,
            @AuthenticationPrincipal UsuarioPrincipal principal) {
        // Codificar password antes de guardar
        if (usuario.getPassword() != null && !usuario.getPassword().isEmpty()) {
            usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        }
        return ResponseEntity.ok(usuarioService.crearUsuario(usuario, principal.getId()));
    }

    @PreAuthorize("hasAnyRole('SISTEM', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(@PathVariable Integer id, @RequestBody Usuario usuario) {
        Usuario existente = usuarioService.findById(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }

        existente.setPersona(usuario.getPersona());
        existente.setCuenta(usuario.getCuenta());
        existente.setRol(usuario.getRol());
        existente.setStatus(usuario.getStatus());
        existente.setFecha_ultima_modificacion(java.time.LocalDateTime.now());

        // Solo actualizar password si viene uno nuevo
        if (usuario.getPassword() != null && !usuario.getPassword().isEmpty()) {
            existente.setPassword(passwordEncoder.encode(usuario.getPassword()));
        }

        return ResponseEntity.ok(usuarioService.save(existente));
    }
}
