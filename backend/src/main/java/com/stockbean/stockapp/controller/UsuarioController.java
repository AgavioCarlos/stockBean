package com.stockbean.stockapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stockbean.stockapp.model.tablas.Usuario;
import com.stockbean.stockapp.service.UsuarioService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/solicitante/{idUsuarioSolicitante}")
    public ResponseEntity<List<Usuario>> listarUsuarios(@PathVariable Integer idUsuarioSolicitante) {
        return ResponseEntity.ok(usuarioService.listarUsuariosPorSolicitante(idUsuarioSolicitante));
    }

    @PostMapping("/crear/{idUsuarioCreador}")
    public ResponseEntity<Usuario> crearUsuario(@RequestBody Usuario usuario, @PathVariable Integer idUsuarioCreador) {
        return ResponseEntity.ok(usuarioService.crearUsuario(usuario, idUsuarioCreador));
    }
}
