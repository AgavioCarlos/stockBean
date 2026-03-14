package com.stockbean.stockapp.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stockbean.stockapp.dto.DatabaseConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.concurrent.Executors;

@Service
public class ConfigService {
    private static final Logger log = LoggerFactory.getLogger(ConfigService.class);
    private final String CONFIG_PATH = "config/db-config.json";
    private final ObjectMapper objectMapper = new ObjectMapper();

    public boolean testConnection(DatabaseConfig config) {
        String url = String.format("jdbc:postgresql://%s:%s/%s", config.getHost(), config.getPort(), config.getDatabase());
        log.info("Probando conexión JDBC a: {}", url);
        
        try {
            // Cargar el driver explícitamente para evitar problemas de ClassLoader en tiempo de ejecución
            Class.forName("org.postgresql.Driver");
            try (Connection connection = DriverManager.getConnection(url, config.getUsername(), config.getPassword())) {
                boolean isValid = connection != null && !connection.isClosed();
                if (isValid) {
                    log.info("✅ Conexión JDBC exitosa");
                }
                return isValid;
            }
        } catch (ClassNotFoundException e) {
            log.error("❌ Driver de PostgreSQL no encontrado: {}", e.getMessage());
            return false;
        } catch (SQLException e) {
            log.error("❌ Conexión JDBC fallida: {} (Estado SQL: {}, Error: {})", 
                e.getMessage(), e.getSQLState(), e.getErrorCode());
            return false;
        } catch (Exception e) {
            log.error("❌ Error inesperado durante la prueba de conexión: {}", e.getMessage());
            return false;
        }
    }

    public void saveConfig(DatabaseConfig config) throws IOException {
        File file = new File(CONFIG_PATH);
        if (!file.getParentFile().exists()) {
            file.getParentFile().mkdirs();
        }
        objectMapper.writerWithDefaultPrettyPrinter().writeValue(file, config);
        log.info("Configuración de base de datos guardada en {}", CONFIG_PATH);
    }

    public DatabaseConfig loadConfig() {
        File file = new File(CONFIG_PATH);
        if (file.exists()) {
            try {
                return objectMapper.readValue(file, DatabaseConfig.class);
            } catch (IOException e) {
                log.error("Error al leer la configuración: {}", e.getMessage());
            }
        }
        return null;
    }

    public void restartApplication() {
        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                log.info("Iniciando secuencia de reinicio en 2 segundos...");
                Thread.sleep(2000);
                
                String javaHome = System.getProperty("java.home");
                String os = System.getProperty("os.name").toLowerCase();
                String javaBin = javaHome + File.separator + "bin" + File.separator + (os.contains("win") ? "java.exe" : "java");
                
                File currentFile = new File(ConfigService.class.getProtectionDomain().getCodeSource().getLocation().toURI());
                
                java.util.List<String> command = new java.util.ArrayList<>();
                command.add(javaBin);
                
                if (currentFile.getName().endsWith(".jar")) {
                    log.info("Detectado entorno JAR: {}", currentFile.getPath());
                    command.add("-jar");
                    command.add(currentFile.getPath());
                } else {
                    log.info("Detectado entorno de desarrollo (clases).");
                    String classpath = System.getProperty("java.class.path");
                    command.add("-cp");
                    command.add(classpath);
                    command.add("com.stockbean.stockapp.StockappApplication");
                }
                
                // Añadir argumentos originales si existen
                String[] args = com.stockbean.stockapp.StockappApplication.getArgs();
                if (args != null && args.length > 0) {
                    for (String arg : args) {
                        command.add(arg);
                    }
                }

                log.info("Ejecutando comando: {}", String.join(" ", command));
                ProcessBuilder builder = new ProcessBuilder(command);
                builder.inheritIO();
                builder.start();
                
                log.info("✅ Nuevo proceso lanzado exitosamente. Cerrando proceso actual...");
                System.exit(0);
            } catch (Exception e) {
                log.error("❌ Falló el reinicio de la aplicación: {}", e.getMessage());
                e.printStackTrace();
            }
        });
    }
}
