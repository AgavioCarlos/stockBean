package com.stockbean.stockapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.stockbean.stockapp.model.tablas.ProductoEmpresa;
import com.stockbean.stockapp.security.UsuarioPrincipal;
import com.stockbean.stockapp.service.ProductoEmpresaService;
import java.util.List;
import java.util.Objects;
import org.springframework.lang.NonNull;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/producto-empresa")
public class ProductoEmpresaController {

    @Autowired
    private ProductoEmpresaService service;

    @GetMapping
    public List<ProductoEmpresa> listar(@AuthenticationPrincipal UsuarioPrincipal principal) {
        return service.listarPorSolicitante(Objects.requireNonNull(principal.getId(), "ID es nulo"));
    }

    @PostMapping
    public ProductoEmpresa crear(@RequestBody ProductoEmpresa productoEmpresa,
            @AuthenticationPrincipal UsuarioPrincipal principal) {
        return service.guardar(productoEmpresa, Objects.requireNonNull(principal.getId(), "ID es nulo"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductoEmpresa> actualizar(@PathVariable @NonNull Integer id,
            @RequestBody ProductoEmpresa productoEmpresa, @AuthenticationPrincipal UsuarioPrincipal principal) {
        ProductoEmpresa actualizado = service.actualizar(id, productoEmpresa, Objects.requireNonNull(principal.getId(), "ID es nulo"));
        return actualizado != null ? ResponseEntity.ok(actualizado) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable @NonNull Integer id,
            @AuthenticationPrincipal UsuarioPrincipal principal) {
        service.eliminar(id, Objects.requireNonNull(principal.getId(), "ID es nulo"));
        return ResponseEntity.noContent().build();
    }
}
