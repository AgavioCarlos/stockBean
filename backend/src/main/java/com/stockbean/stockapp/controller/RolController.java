package com.stockbean.stockapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.stockbean.stockapp.model.catalogos.Rol;
import com.stockbean.stockapp.service.RolService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;


@RestController
@RequestMapping("/roles")
public class RolController {

    @Autowired
    private RolService rolService;

    @GetMapping
    public List<Rol> listar() {
        return rolService.listarTodos();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Rol> obtener(@PathVariable Integer id) {
        Rol rol = rolService.obtenerPorId(id);
        return rol != null ? ResponseEntity.ok(rol) : ResponseEntity.notFound().build();
    }

    @PostMapping()
    public Rol crear(@RequestBody Rol rol) {
        return rolService.guardar(rol);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Rol> actualizar(@PathVariable Integer id, @RequestBody Rol rol) {
        Rol actualizado = rolService.actualizar(id, rol);
        return actualizado != null ? ResponseEntity.ok(actualizado) : ResponseEntity.notFound().build();
    }
}
