package com.stockbean.stockapp.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stockbean.stockapp.model.catalogos.Unidad;
import com.stockbean.stockapp.service.UnidadService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/unidades")
public class UnidadController {
    @Autowired 
    private UnidadService unidadService;

    @GetMapping
    public List<Unidad> listar() {
        return unidadService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Unidad> obtener(@PathVariable Integer id){
        Unidad unidades = unidadService.obtenerPorId(id);
        return unidades != null ? ResponseEntity.ok(unidades) : ResponseEntity.notFound().build();
    } 

    @PostMapping()
    public Unidad crear(@RequestBody Unidad unidades){
        return unidadService.guardar(unidades);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Unidad> actualizar(@PathVariable Integer id, @RequestBody Unidad unidades) {
        Unidad actualizado = unidadService.actualizar(id, unidades);
        return actualizado != null ? ResponseEntity.ok(actualizado) : ResponseEntity.notFound().build();
    }
}
