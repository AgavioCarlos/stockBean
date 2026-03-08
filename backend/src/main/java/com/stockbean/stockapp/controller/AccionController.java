package com.stockbean.stockapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stockbean.stockapp.model.catalogos.Accion;
import com.stockbean.stockapp.repository.AccionRepository;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/acciones")
public class AccionController {

    @Autowired
    private AccionRepository accionRepository;

    /**
     * GET /acciones
     * Devuelve todas las acciones activas del catálogo (view, create, update,
     * delete, export).
     */
    @GetMapping
    public ResponseEntity<List<Accion>> listarAcciones() {
        List<Accion> acciones = accionRepository.findByStatusTrue();
        return ResponseEntity.ok(acciones);
    }
}
