package com.stockbean.stockapp.controller;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.stockbean.stockapp.dto.GuardarAccionRequest;
import com.stockbean.stockapp.dto.UsuarioAccionDTO;
import com.stockbean.stockapp.service.UsuarioAccionService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/usuarios-acciones")
public class UsuarioAccionController {

    private static final Logger log = LoggerFactory.getLogger(UsuarioAccionController.class);

    @Autowired
    private UsuarioAccionService usuarioAccionService;

    /**
     * GET /usuarios-acciones/{idUsuario}?idEmpresa=X
     * Obtiene la matriz completa de permisos (pantallas x acciones) para un usuario
     * en una empresa.
     */
    @GetMapping("/{idUsuario}")
    public ResponseEntity<List<UsuarioAccionDTO>> obtenerMatriz(
            @PathVariable Integer idUsuario,
            @RequestParam Integer idEmpresa) {
        log.info(">>> GET /usuarios-acciones/{} ?idEmpresa={}", idUsuario, idEmpresa);
        List<UsuarioAccionDTO> matriz = usuarioAccionService.obtenerMatrizPermisos(idUsuario, idEmpresa);
        log.info("<<< GET /usuarios-acciones/{} -> {} pantallas retornadas", idUsuario, matriz.size());
        return ResponseEntity.ok(matriz);
    }

    /**
     * POST /usuarios-acciones/{idUsuario}?idEmpresa=X
     * Guarda/actualiza masivamente los permisos de un usuario en una empresa.
     * Body: Array de { idPantalla, idAccion, permitido }
     */
    @PostMapping("/{idUsuario}")
    public ResponseEntity<Map<String, String>> guardarPermisos(
            @PathVariable Integer idUsuario,
            @RequestParam Integer idEmpresa,
            @RequestBody List<GuardarAccionRequest> permisos) {
        usuarioAccionService.guardarPermisos(idUsuario, idEmpresa, permisos);
        return ResponseEntity.ok(Map.of("mensaje", "Permisos actualizados correctamente"));
    }
}
