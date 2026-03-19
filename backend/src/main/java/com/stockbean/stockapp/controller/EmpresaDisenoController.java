package com.stockbean.stockapp.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.stockbean.stockapp.model.admin.EmpresaDiseno;
import com.stockbean.stockapp.service.EmpresaDisenoService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/empresas-diseno")
public class EmpresaDisenoController {

    private static final Logger logger = LoggerFactory.getLogger(EmpresaDisenoController.class);

    @Autowired
    private EmpresaDisenoService service;

    /**
     * Obtener el diseño por ID de Empresa (para aplicar estilos al logearse)
     */
    @GetMapping("/empresa/{idEmpresa}")
    public ResponseEntity<EmpresaDiseno> obtenerDiseno(@PathVariable Integer idEmpresa) {
        return service.obtenerDisenoPorEmpresa(idEmpresa)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    /**
     * Crear el diseño para una empresa (Admin)
     */
    @PreAuthorize("hasAnyRole('SISTEM', 'ADMIN')")
    @PostMapping
    public ResponseEntity<EmpresaDiseno> guardar(@RequestBody EmpresaDiseno diseno) {
        logger.info("🔹 POST /empresas-diseno - Guardando nuevo diseño");
        return ResponseEntity.ok(service.guardarODiseno(diseno));
    }

    /**
     * Actualizar el diseño existente de una empresa
     */
    @PreAuthorize("hasAnyRole('SISTEM', 'ADMIN')")
    @PutMapping("/empresa/{idEmpresa}")
    public ResponseEntity<EmpresaDiseno> actualizar(@PathVariable Integer idEmpresa, 
                                                  @RequestBody EmpresaDiseno diseno) {
        logger.info("🔹 PUT /empresas-diseno/empresa/{} - Actualizando diseño", idEmpresa);
        return ResponseEntity.ok(service.actualizarDiseno(idEmpresa, diseno));
    }

    /**
     * Subir logotipo de la empresa físicamente y guardar ruta
     */
    @PreAuthorize("hasAnyRole('SISTEM', 'ADMIN')")
    @PostMapping("/empresa/{idEmpresa}/logo")
    public ResponseEntity<String> subirLogo(@PathVariable Integer idEmpresa, @RequestParam("file") MultipartFile file) {
        logger.info("🔹 POST /empresas-diseno/empresa/{}/logo - Subiendo logotipo", idEmpresa);
        try {
            String fileName = service.guardarLogo(idEmpresa, file);
            return ResponseEntity.ok(fileName);
        } catch (Exception e) {
            logger.error("Error al subir logo: ", e);
            return ResponseEntity.status(500).body("Error al subir el archivo: " + e.getMessage());
        }
    }
}
