package com.stockbean.stockapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stockbean.stockapp.model.tablas.Proveedor;
import com.stockbean.stockapp.service.ProveedorService;

@RestController
@RequestMapping("/proveedores")
@CrossOrigin(origins = "*") // Allows calls from frontend
public class ProveedorController {

    @Autowired
    private ProveedorService proveedorService;

    // @GetMapping
    // public List<Proveedor> obtenerTodos() {
    // return proveedorService.obtenerTodosActivos(); // By default showing actives
    // only for frontend list like others
    // }

    @GetMapping()
    public List<Proveedor> listarTodo() {
        return proveedorService.obtenerTodos(); // Showing all including history
    }

    @PostMapping
    public Proveedor crear(@RequestBody Proveedor proveedor) {
        return proveedorService.guardar(proveedor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Proveedor> actualizar(@PathVariable @NonNull Integer id, @RequestBody Proveedor proveedor) {
        try {
            Proveedor actualizado = proveedorService.actualizar(id, proveedor);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable @NonNull Integer id) {
        proveedorService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
