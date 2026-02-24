package com.stockbean.stockapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.stockbean.stockapp.model.admin.PersonaEmpresa;
import com.stockbean.stockapp.security.UsuarioPrincipal;
import com.stockbean.stockapp.service.PersonaEmpresaService;

@RestController
@RequestMapping("/persona_empresa")
@CrossOrigin("*")
@PreAuthorize("hasAnyRole('SISTEM', 'ADMIN', 'GERENTE', 'CAJERO')")
public class PersonaEmpresaController {

    @Autowired
    private PersonaEmpresaService personaEmpresaService;

    @GetMapping
    public ResponseEntity<?> listar(@AuthenticationPrincipal UsuarioPrincipal principal) {
        try {
            List<PersonaEmpresa> lista = personaEmpresaService.listarPorUsuario(principal.getId());
            return ResponseEntity.ok(lista);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> guardar(
            @RequestBody PersonaEmpresa personaEmpresa,
            @AuthenticationPrincipal UsuarioPrincipal principal) {
        try {
            return ResponseEntity.ok(personaEmpresaService.guardar(personaEmpresa, principal.getId()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(
            @PathVariable Integer id,
            @RequestBody PersonaEmpresa personaEmpresa,
            @AuthenticationPrincipal UsuarioPrincipal principal) {
        try {
            return ResponseEntity.ok(personaEmpresaService.actualizar(id, personaEmpresa, principal.getId()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(
            @PathVariable Integer id,
            @AuthenticationPrincipal UsuarioPrincipal principal) {
        try {
            personaEmpresaService.eliminar(id, principal.getId());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
