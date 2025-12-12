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

import com.stockbean.stockapp.model.tablas.UsuarioSucursal;
import com.stockbean.stockapp.service.UsuarioSucursalService;

@RestController
@RequestMapping("/usuario-sucursales")
public class UsuarioSucursalController {

    @Autowired
    private UsuarioSucursalService usuarioSucursalService;

    @GetMapping
    public List<UsuarioSucursal> listarUsuarioSucursal() {
        return usuarioSucursalService.listarTodos();
    }

    @PostMapping
    public ResponseEntity<UsuarioSucursal> asignarUsuarioSucursal(@RequestBody UsuarioSucursal usuarioSucursal) {
        UsuarioSucursal nuevo = usuarioSucursalService.guardar(usuarioSucursal);
        return ResponseEntity.ok(nuevo);
    }

    @PutMapping
    public ResponseEntity<UsuarioSucursal> actualizarUsuarioSucursal(@RequestBody UsuarioSucursal usuarioSucursal) {
        UsuarioSucursal actualizado = usuarioSucursalService.actualizar(usuarioSucursal);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuarioSucursal(@PathVariable Integer id) {
        usuarioSucursalService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
