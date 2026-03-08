package com.stockbean.stockapp.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.stockbean.stockapp.security.UsuarioPrincipal;
import com.stockbean.stockapp.dto.SuscripcionAdminDTO;
import com.stockbean.stockapp.model.tablas.Suscripcion;
import com.stockbean.stockapp.service.SuscripcionService;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/suscripciones")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('SISTEM')")
public class SuscripcionController {

    @Autowired
    private SuscripcionService suscripcionService;

    @GetMapping("/admin")
    public ResponseEntity<?> obtenerSuscripcionesAdmin() {
        List<SuscripcionAdminDTO> list = suscripcionService.obtenerSuscripcionesAdmin();
        return ResponseEntity.ok(list);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> cambiarStatus(@PathVariable Integer id, @RequestBody Map<String, Boolean> payload) {
        Boolean status = payload.get("status");
        Suscripcion s = suscripcionService.cambiarStatus(id, status);
        if (s != null) {
            return ResponseEntity.ok(s);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/extend")
    public ResponseEntity<?> extenderFecha(@PathVariable Integer id, @RequestBody Map<String, String> payload) {
        try {
            LocalDateTime nuevaFecha = LocalDateTime.parse(payload.get("fechaFin"));
            Suscripcion s = suscripcionService.extenderFecha(id, nuevaFecha);
            if (s != null) {
                return ResponseEntity.ok(s);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Formato de fecha inválido.");
        }
    }
}
