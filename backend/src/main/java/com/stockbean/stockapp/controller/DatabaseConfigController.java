package com.stockbean.stockapp.controller;

import com.stockbean.stockapp.dto.DatabaseConfig;
import com.stockbean.stockapp.service.ConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/config")
@CrossOrigin(origins = "*")
public class DatabaseConfigController {

    @Autowired
    private ConfigService configService;

    private static final String MASTER_PASSWORD = "Baluarte2024*";

    private boolean validateMasterPassword(String password) {
        return MASTER_PASSWORD.equals(password);
    }

    @PostMapping("/database")
    public ResponseEntity<?> configureDatabase(
            @RequestHeader(value = "X-Config-Password", required = false) String pass,
            @RequestBody DatabaseConfig config) {
            
        if (!validateMasterPassword(pass)) {
            return ResponseEntity.status(401).body(Map.of(
                "success", false,
                "mensaje", "INVALID_MASTER_PASSWORD"
            ));
        }

        if (!configService.testConnection(config)) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "mensaje", "CONNECTION_FAILED"
            ));
        }

        try {
            configService.saveConfig(config);
            configService.restartApplication();
            return ResponseEntity.ok(Map.of(
                "success", true,
                "mensaje", "RESTARTING"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "mensaje", "ERROR_SAVING_CONFIG"
            ));
        }
    }

    @PostMapping("/database/test")
    public ResponseEntity<?> testConnection(
            @RequestHeader(value = "X-Config-Password", required = false) String pass,
            @RequestBody DatabaseConfig config) {
            
        if (!validateMasterPassword(pass)) {
            return ResponseEntity.status(401).body(Map.of(
                "success", false,
                "mensaje", "INVALID_MASTER_PASSWORD"
            ));
        }

        if (configService.testConnection(config)) {
            return ResponseEntity.ok(Map.of("success", true, "mensaje", "CONNECTION_SUCCESS"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("success", false, "mensaje", "CONNECTION_FAILED"));
        }
    }

    @GetMapping("/database")
    public ResponseEntity<DatabaseConfig> getConfig() {
        DatabaseConfig config = configService.loadConfig();
        if (config == null) {
            // Valores por defecto para evitar nulos en el frontend
            config = new DatabaseConfig();
            config.setMode("SERVER");
            config.setPort("5432");
            config.setHost("localhost");
        }
        return ResponseEntity.ok(config);
    }
}
