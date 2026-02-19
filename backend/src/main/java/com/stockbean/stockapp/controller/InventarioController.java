package com.stockbean.stockapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stockbean.stockapp.model.tablas.Inventario;
import com.stockbean.stockapp.service.InventarioService;

@RestController
@RequestMapping("/inventario")
@CrossOrigin("*")
public class InventarioController {

    @Autowired
    private InventarioService inventarioService;

    @GetMapping
    public ResponseEntity<?> listar(
            @RequestParam(required = true) Integer idUsuario,
            @RequestParam(required = true) Integer idSucursal) {

        try {
            List<Inventario> inventario = inventarioService.listarPorUsuarioYSucursal(idUsuario, idSucursal);
            return ResponseEntity.ok(inventario);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> guardar(
            @RequestBody Inventario inventario,
            @RequestParam Integer idUsuario) {
        try {
            return ResponseEntity.ok(inventarioService.guardar(inventario, idUsuario));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping
    public ResponseEntity<?> actualizar(
            @RequestBody Inventario inventario,
            @RequestParam Integer idUsuario) {
        // Assuming ID is inside the body, or add @PathVariable ID logic if preferred.
        // But previous controller body-based.
        // It's better to align with previous controller `actualizar`.
        // Previous controller had `actualizar(@RequestBody Inventario)` where `id` is
        // in body.
        // But PUT convention usually has ID in URL.
        // Let's support ID in body for now as existing code implied.
        // Wait, existing controller had `@PutMapping public ResponseEntity<Inventario>
        // actualizar(@RequestBody Inventario inventario)`.

        try {
            if (inventario.getId_inventario() == null) {
                return ResponseEntity.badRequest().body("ID de inventario es requerido para actualizar");
            }
            return ResponseEntity
                    .ok(inventarioService.actualizar(inventario.getId_inventario(), inventario, idUsuario));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarPorId(
            @PathVariable Integer id,
            @RequestBody Inventario inventario,
            @RequestParam Integer idUsuario) {
        try {
            return ResponseEntity.ok(inventarioService.actualizar(id, inventario, idUsuario));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(
            @PathVariable Integer id,
            @RequestParam Integer idUsuario) {
        try {
            inventarioService.eliminar(id, idUsuario);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
