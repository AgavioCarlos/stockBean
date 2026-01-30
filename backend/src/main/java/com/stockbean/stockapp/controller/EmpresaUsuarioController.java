package com.stockbean.stockapp.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import com.stockbean.stockapp.model.admin.EmpresaUsuario;
import com.stockbean.stockapp.service.EmpresaUsuarioService;

@RestController
@RequestMapping("/empresa_usuarios")
public class EmpresaUsuarioController {

    @Autowired
    private EmpresaUsuarioService empresaUsuarioService;

    @GetMapping
    public List<EmpresaUsuario> listarTodos() {
        return empresaUsuarioService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmpresaUsuario> obtenerPorId(@PathVariable Integer id) {
        EmpresaUsuario empresaUsuario = empresaUsuarioService.obtenerPorId(id);
        return ResponseEntity.ok(empresaUsuario);
    }

    @PostMapping
    public ResponseEntity<EmpresaUsuario> guardar(@RequestBody EmpresaUsuario empresaUsuario) {
        EmpresaUsuario resultado = empresaUsuarioService.guardar(empresaUsuario);
        return ResponseEntity.ok(resultado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmpresaUsuario> actualizar(@PathVariable Integer id,
            @RequestBody EmpresaUsuario empresaUsuarioActualizado) {
        EmpresaUsuario empresaUsuario = empresaUsuarioService.actualizar(id, empresaUsuarioActualizado);
        return ResponseEntity.ok(empresaUsuario);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<EmpresaUsuario> eliminar(@PathVariable Integer id) {
        empresaUsuarioService.eliminar(id);
        return ResponseEntity.ok().build();
    }

}
