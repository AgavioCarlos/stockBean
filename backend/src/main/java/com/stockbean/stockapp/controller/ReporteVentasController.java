package com.stockbean.stockapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stockbean.stockapp.dto.DashboardStatsDTO;
import com.stockbean.stockapp.dto.VentaReporteDTO;
import com.stockbean.stockapp.dto.VentasPorDiaDTO;
import com.stockbean.stockapp.security.UsuarioPrincipal;
import com.stockbean.stockapp.service.ReporteVentasService;

@RestController
@RequestMapping("/reportes/ventas")
@CrossOrigin("*")
@PreAuthorize("hasAnyRole('SISTEM', 'ADMIN', 'GERENTE')")
public class ReporteVentasController {

    @Autowired
    private ReporteVentasService reporteVentasService;

    /**
     * Resumen de estadísticas para el Dashboard (Hoy vs Ayer).
     * GET /reportes/ventas/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> obtenerEstadisticas(@AuthenticationPrincipal UsuarioPrincipal principal) {
        return ResponseEntity.ok(reporteVentasService.obtenerResumenDashboard(principal.getId()));
    }

    /**
     * Resumen de ventas agrupadas por día para el perfil.
     * GET /reportes/ventas/por-dia
     */
    @GetMapping("/por-dia")
    public ResponseEntity<?> obtenerVentasPorDia(@AuthenticationPrincipal UsuarioPrincipal principal) {
        try {
            List<VentasPorDiaDTO> reporte = reporteVentasService.obtenerVentasPorDia(principal.getId());
            return ResponseEntity.ok(reporte);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Obtener reporte de ventas según el rol del usuario.
     * SISTEM: todas, ADMIN: su empresa, GERENTE: su sucursal.
     * GET /reportes/ventas
     */
    @GetMapping
    public ResponseEntity<?> obtenerReporte(@AuthenticationPrincipal UsuarioPrincipal principal) {
        try {
            List<VentaReporteDTO> reporte = reporteVentasService.obtenerReporteVentas(principal.getId());
            return ResponseEntity.ok(reporte);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Obtener reporte filtrado por sucursal.
     * GET /reportes/ventas/sucursal/{idSucursal}
     */
    @GetMapping("/sucursal/{idSucursal}")
    public ResponseEntity<?> obtenerReportePorSucursal(
            @PathVariable Integer idSucursal,
            @AuthenticationPrincipal UsuarioPrincipal principal) {
        try {
            List<VentaReporteDTO> reporte = reporteVentasService.obtenerReportePorSucursal(
                    idSucursal, principal.getId());
            return ResponseEntity.ok(reporte);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
