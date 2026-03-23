package com.stockbean.stockapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.stockbean.stockapp.model.catalogos.TipoPrecio;
import com.stockbean.stockapp.service.TipoPrecioService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/tipos-precio")
public class TipoPrecioController {

    @Autowired
    private TipoPrecioService tipoPrecioService;

    @GetMapping
    public ResponseEntity<List<TipoPrecio>> listarTodos() {
        return ResponseEntity.ok(tipoPrecioService.listarTodos());
    }

    @PostMapping
    public ResponseEntity<TipoPrecio> crear(@RequestBody TipoPrecio tipoPrecio) {
        return ResponseEntity.ok(tipoPrecioService.guardar(tipoPrecio));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TipoPrecio> actualizar(@PathVariable Integer id, @RequestBody TipoPrecio tipoPrecio) {
        try {
            TipoPrecio actualizado = tipoPrecioService.actualizar(id, tipoPrecio);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        tipoPrecioService.eliminar(id);
        return ResponseEntity.ok().build();
    }
}
