package com.stockbean.stockapp.controller;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import com.stockbean.stockapp.dto.EmpresaUsuarioDTO;
import com.stockbean.stockapp.model.admin.Empresa;
import com.stockbean.stockapp.security.UsuarioPrincipal;
import com.stockbean.stockapp.service.EmpresaService;
import lombok.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/empresas")
public class EmpresaController {

    private static final Logger logger = LoggerFactory.getLogger(EmpresaController.class);

    @Autowired
    private EmpresaService empresaService;

    @PreAuthorize("hasRole('SISTEM')")
    @GetMapping
    public List<Empresa> listarTodos() {
        logger.info("🔹 GET /empresas - Iniciando listarTodos()");
        try {
            List<Empresa> empresas = empresaService.listarTodos();
            logger.info("✅ GET /empresas - Retornando {} empresas", empresas.size());
            return empresas;
        } catch (Exception e) {
            logger.error("❌ GET /empresas - ERROR: {}", e.getMessage(), e);
            throw e;
        }
    }

    @PreAuthorize("hasAnyRole('SISTEM', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<Empresa> obtenerPorId(@PathVariable @NonNull Integer id) {
        Empresa empresa = empresaService.obtenerPorId(id);
        return ResponseEntity.ok(empresa);
    }

    @PreAuthorize("hasRole('SISTEM')")
    @PostMapping
    public ResponseEntity<Empresa> guardar(@RequestBody Empresa empresa) {
        Empresa resultado = empresaService.guardar(empresa);
        return ResponseEntity.ok(resultado);
    }

    @PreAuthorize("hasAnyRole('SISTEM', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Empresa> actualizar(@PathVariable @NonNull Integer id,
            @RequestBody Empresa empresaActualizado) {
        Empresa empresa = empresaService.actualizar(id, empresaActualizado);
        return ResponseEntity.ok(empresa);
    }

    @PreAuthorize("hasRole('SISTEM')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Empresa> eliminar(@PathVariable @NonNull Integer id) {
        empresaService.eliminar(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/usuario/{idEmpresa}")
    public ResponseEntity<List<EmpresaUsuarioDTO>> obtenerEmpresasPorUsuario(
            @PathVariable @NonNull Integer idEmpresa) {
        List<EmpresaUsuarioDTO> empresas = empresaService.obtenerEmpresasPorUsuario(idEmpresa);
        return ResponseEntity.ok(empresas);
    }

    @PostMapping("/configurar")
    public ResponseEntity<Empresa> configurarEmpresa(@RequestBody Empresa empresa,
            @AuthenticationPrincipal UsuarioPrincipal principal) {
        Empresa resultado = empresaService.configurarEmpresa(empresa, principal.getId());
        return ResponseEntity.ok(resultado);
    }

}
