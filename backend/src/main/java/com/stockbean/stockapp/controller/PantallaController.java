package com.stockbean.stockapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stockbean.stockapp.dto.PantallaDTO;
import com.stockbean.stockapp.security.AuthHelper;
import com.stockbean.stockapp.service.PantallaService;

@RestController
@RequestMapping("/pantallas")
public class PantallaController {

    @Autowired
    private PantallaService pantallaService;

    @Autowired
    private AuthHelper authHelper;

    @GetMapping
    public ResponseEntity<?> getPantallasByRol() {
        Integer idRol = authHelper.getIdRolFromToken();

        if (idRol == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("No se pudo obtener el rol del usuario autenticado");
        }

        List<PantallaDTO> pantallas = pantallaService.findByIdPantalla(idRol);
        return ResponseEntity.ok(pantallas);
    }

}
