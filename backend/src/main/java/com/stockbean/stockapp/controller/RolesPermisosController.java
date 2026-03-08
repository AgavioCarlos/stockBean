package com.stockbean.stockapp.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stockbean.stockapp.dto.JerarquiaPermisosDTO;
import com.stockbean.stockapp.dto.PantallaAsignacionDTO;
import com.stockbean.stockapp.dto.RolAsignacionDTO;
import com.stockbean.stockapp.model.catalogos.Permiso;
import com.stockbean.stockapp.service.RolesPermisosService;

@RestController
@RequestMapping("/admin/roles-permisos")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('SISTEM')")
public class RolesPermisosController {

    @Autowired
    private RolesPermisosService rolesPermisosService;

    @GetMapping("/{idRol}")
    public ResponseEntity<List<JerarquiaPermisosDTO>> obtenerArbol(@PathVariable Integer idRol) {
        return ResponseEntity.ok(rolesPermisosService.obtenerArbol(idRol));
    }

    @PutMapping("/{idRol}")
    public ResponseEntity<Void> actualizarPermisos(@PathVariable Integer idRol,
            @RequestBody Map<String, List<Integer>> payload) {
        List<Integer> idPermisos = payload.get("idPermisos");
        rolesPermisosService.actualizarPermisos(idRol, idPermisos);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/permisos")
    public ResponseEntity<List<Permiso>> obtenerTodosLosPermisos() {
        return ResponseEntity.ok(rolesPermisosService.obtenerTodosLosPermisos());
    }

    @PostMapping("/permisos")
    public ResponseEntity<Permiso> crearPermiso(@RequestBody Permiso permiso) {
        return ResponseEntity.ok(rolesPermisosService.crearPermiso(permiso));
    }

    @GetMapping("/permisos/{idPermiso}/pantallas")
    public ResponseEntity<List<PantallaAsignacionDTO>> obtenerPantallasPorPermiso(@PathVariable Integer idPermiso) {
        return ResponseEntity.ok(rolesPermisosService.obtenerPantallasPorPermiso(idPermiso));
    }

    @PutMapping("/permisos/{idPermiso}/pantallas")
    public ResponseEntity<Void> actualizarPantallasPorPermiso(@PathVariable Integer idPermiso,
            @RequestBody Map<String, List<Integer>> payload) {
        List<Integer> idPantallas = payload.get("idPantallas");
        rolesPermisosService.actualizarPantallasPorPermiso(idPermiso, idPantallas);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/permisos/{idPermiso}/roles")
    public ResponseEntity<List<RolAsignacionDTO>> obtenerRolesPorPermiso(@PathVariable Integer idPermiso) {
        return ResponseEntity.ok(rolesPermisosService.obtenerRolesPorPermiso(idPermiso));
    }

    @PutMapping("/permisos/{idPermiso}/roles")
    public ResponseEntity<Void> actualizarRolesPorPermiso(@PathVariable Integer idPermiso,
            @RequestBody Map<String, List<Integer>> payload) {
        List<Integer> idRoles = payload.get("idRoles");
        rolesPermisosService.actualizarRolesPorPermiso(idPermiso, idRoles);
        return ResponseEntity.noContent().build();
    }
}
