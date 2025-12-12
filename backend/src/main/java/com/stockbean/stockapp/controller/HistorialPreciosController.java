package com.stockbean.stockapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stockbean.stockapp.model.tablas.HistorialPrecios;
import com.stockbean.stockapp.service.HistorialPreciosServices;

@RestController
@RequestMapping("/historial-precios")
public class HistorialPreciosController {
    @Autowired
    private HistorialPreciosServices historialPreciosServices;
    
    @GetMapping
    public List<HistorialPrecios> listarTodos() {
        return historialPreciosServices.listarTodos();
    }
    
    @GetMapping("/actuales")
    public List<HistorialPrecios> listarActuales() {
        return historialPreciosServices.listarActuales();
    }
    
    @GetMapping("/historicos/{id}")
    public List<HistorialPrecios> listarHistoricosId(@PathVariable Integer id) {
        return historialPreciosServices.listarHistoricosId(id);
    }
    
    @PostMapping
    public HistorialPrecios guardar(@RequestBody HistorialPrecios historialPrecios) {
        return historialPreciosServices.guardar(historialPrecios);
    }
    
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        historialPreciosServices.eliminar(id);
    }
    
}
