package com.stockbean.stockapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stockbean.stockapp.model.tablas.Alerta;
import com.stockbean.stockapp.security.UsuarioPrincipal;
import com.stockbean.stockapp.service.AlertaService;

@RestController
@RequestMapping("/alertas")
@CrossOrigin("*")
@PreAuthorize("hasAnyRole('SISTEM', 'ADMIN', 'GERENTE', 'CAJERO')")
public class AlertaController {

    @Autowired
    private AlertaService alertaService;

    /**
     * Obtener alertas activas del usuario autenticado.
     * El servicio filtra según el rol (SISTEM, ADMIN, GERENTE, CAJERO).
     * GET /alertas
     */
    @GetMapping
    public ResponseEntity<?> obtenerAlertas(@AuthenticationPrincipal UsuarioPrincipal principal) {
        try {
            List<Alerta> alertas = alertaService.obtenerAlertasPorUsuario(principal.getId());
            return ResponseEntity.ok(alertas);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Contar alertas activas del usuario (para el badge del header).
     * GET /alertas/count
     */
    @GetMapping("/count")
    public ResponseEntity<?> contarAlertas(@AuthenticationPrincipal UsuarioPrincipal principal) {
        try {
            Long count = alertaService.contarAlertasPorUsuario(principal.getId());
            return ResponseEntity.ok(count);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Marcar una alerta como leída.
     * PUT /alertas/{id}/leer
     */
    @PutMapping("/{id}/leer")
    public ResponseEntity<?> marcarComoLeida(@PathVariable Integer id) {
        try {
            alertaService.marcarComoLeida(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Marcar todas las alertas del usuario como leídas.
     * PUT /alertas/leer-todas
     */
    @PutMapping("/leer-todas")
    public ResponseEntity<?> marcarTodasComoLeidas(@AuthenticationPrincipal UsuarioPrincipal principal) {
        try {
            alertaService.marcarTodasComoLeidas(principal.getId());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
