package com.stockbean.stockapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.stockbean.stockapp.dto.PantallaDTO;
import com.stockbean.stockapp.model.admin.Pantallas;
import com.stockbean.stockapp.repository.EmpresaUsuarioRepository;
import com.stockbean.stockapp.security.AuthHelper;
import com.stockbean.stockapp.service.PantallaService;

@RestController
@RequestMapping("/pantallas")
public class PantallaController {

    @Autowired
    private PantallaService pantallaService;

    @Autowired
    private AuthHelper authHelper;

    @Autowired
    private EmpresaUsuarioRepository empresaUsuarioRepository;

    /**
     * GET /pantallas
     * Pantallas del menú lateral basadas en admin_usuario_pantalla (donde ver = true).
     * El usuario y la empresa se obtienen del JWT.
     */
    @GetMapping
    public ResponseEntity<?> getPantallasUsuario(@RequestParam(required = false) Integer idEmpresa) {
        Integer idUsuario = authHelper.getIdUsuarioFromToken();
        Integer idRol = authHelper.getIdRolFromToken();

        if (idUsuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("No se pudo obtener el usuario autenticado");
        }

        // Si no se pasa idEmpresa, intentar obtener la primera empresa del usuario
        if (idEmpresa == null) {
            List<Integer> idsEmpresas = empresaUsuarioRepository.findIdEmpresaByUsuarioId(idUsuario);
            if (!idsEmpresas.isEmpty()) {
                idEmpresa = idsEmpresas.get(0);
            }
            // Si sigue siendo null (ej. Sistemas sin empresa), se busca sin filtrar por empresa
        }

        List<PantallaDTO> pantallas = pantallaService.findPantallasUsuario(idUsuario, idEmpresa);
        return ResponseEntity.ok(pantallas);
    }

    /**
     * GET /pantallas/todas
     * Devuelve todas las pantallas activas (sin filtrar por rol ni esRoot).
     * Para uso administrativo en la matriz de permisos de rol.
     */
    @GetMapping("/todas")
    public ResponseEntity<?> getTodasPantallas() {
        List<Pantallas> pantallas = pantallaService.findAllActivas();
        return ResponseEntity.ok(pantallas);
    }

    /**
     * GET /pantallas/por-rol
     * Devuelve las pantallas filtradas por esRoot según el rol del usuario autenticado:
     * - Sistemas (rol 1): solo esRoot = true
     * - Otros roles: esRoot IS NULL o false
     * Para uso en la asignación de permisos de usuario.
     */
    @GetMapping("/por-rol")
    public ResponseEntity<?> getPantallasFiltradas() {
        Integer idRol = authHelper.getIdRolFromToken();

        if (idRol == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("No se pudo obtener el rol del usuario autenticado");
        }

        List<Pantallas> pantallas = pantallaService.findPantallasByRol(idRol);
        return ResponseEntity.ok(pantallas);
    }
}
