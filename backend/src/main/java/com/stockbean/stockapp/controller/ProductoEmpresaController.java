package com.stockbean.stockapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.stockbean.stockapp.model.tablas.ProductoEmpresa;
import com.stockbean.stockapp.security.UsuarioPrincipal;
import com.stockbean.stockapp.service.ProductoEmpresaService;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/producto-empresa")
public class ProductoEmpresaController {

    @Autowired
    private ProductoEmpresaService service;

    @GetMapping
    public List<ProductoEmpresa> listar(@AuthenticationPrincipal UsuarioPrincipal principal) {
        return service.listarPorSolicitante(principal.getId());
    }

    @PostMapping
    public ProductoEmpresa crear(@RequestBody ProductoEmpresa productoEmpresa,
            @AuthenticationPrincipal UsuarioPrincipal principal) {
        return service.guardar(productoEmpresa, principal.getId());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductoEmpresa> actualizar(@PathVariable Integer id,
            @RequestBody ProductoEmpresa productoEmpresa, @AuthenticationPrincipal UsuarioPrincipal principal) {
        ProductoEmpresa actualizado = service.actualizar(id, productoEmpresa, principal.getId());
        return actualizado != null ? ResponseEntity.ok(actualizado) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id,
            @AuthenticationPrincipal UsuarioPrincipal principal) {
        service.eliminar(id, principal.getId());
        return ResponseEntity.noContent().build();
    }
}
