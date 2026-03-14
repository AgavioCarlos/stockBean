package com.stockbean.stockapp.controller;

import com.stockbean.stockapp.model.admin.Empresa;
import com.stockbean.stockapp.dto.DatabaseConfig;
import com.stockbean.stockapp.service.ConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class SystemController {

    @Autowired
    private ConfigService configService;

    @Autowired
    private com.stockbean.stockapp.service.EmpresaService empresaService;

    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        return status;
    }

    @GetMapping("/system/info")
    public Map<String, Object> getSystemInfo() {
        Map<String, Object> info = new HashMap<>();
        DatabaseConfig config = configService.loadConfig();
        
        info.put("systemName", "Baluarte");
        info.put("mode", config != null ? config.getMode() : "SERVER");
        
        // Intentar obtener la empresa desde la base de datos conectada actualmente
        try {
            Empresa emp = empresaService.getFirstActive();
            if (emp != null) {
                info.put("company", emp.getNombreComercial());
                info.put("companyId", emp.getIdEmpresa());
            } else {
                info.put("company", "Baluarte Software Solutions");
            }
        } catch (Exception e) {
            info.put("company", "Sin conexión a Base de Datos");
        }
        
        return info;
    }
}
