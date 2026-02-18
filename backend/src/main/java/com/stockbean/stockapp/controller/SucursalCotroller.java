package com.stockbean.stockapp.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.stockbean.stockapp.model.tablas.Sucursal;
import com.stockbean.stockapp.service.SucursalService;

@RestController
@RequestMapping("/sucursales")
public class SucursalCotroller {

    @Autowired
    private SucursalService sucursalService;

    @GetMapping
    public List<Sucursal> listar() {
        return sucursalService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sucursal> obtener(@PathVariable Integer id) {
        Sucursal sucursal = sucursalService.obtenerPorId(id);
        return sucursal != null ? ResponseEntity.ok(sucursal) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Sucursal> guardar(@RequestBody Sucursal sucursal) {
        Sucursal nuevaSucursal = sucursalService.guardar(sucursal);
        return ResponseEntity.ok(nuevaSucursal);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sucursal> actualizar(@PathVariable Integer id, @RequestBody Sucursal sucursal) {
        Sucursal actualizada = sucursalService.actualizar(id, sucursal);
        return actualizada != null ? ResponseEntity.ok(actualizada) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        sucursalService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
