package com.stockbean.stockapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class StockappApplication {

	private static String[] args;

	public static void main(String[] args) {
		StockappApplication.args = args;
		loadExternalConfig();
		SpringApplication.run(StockappApplication.class, args);
	}

	public static String[] getArgs() {
		return args;
	}

	private static void loadExternalConfig() {
		java.io.File configFile = new java.io.File("config/db-config.json");
		if (configFile.exists()) {
			System.out.println("🔍 Detectado archivo de configuración externa: " + configFile.getAbsolutePath());
			try {
				com.fasterxml.jackson.databind.JsonNode node = new com.fasterxml.jackson.databind.ObjectMapper().readTree(configFile);
				String host = node.has("host") ? node.get("host").asText() : "";
				String port = node.has("port") ? node.get("port").asText() : "5432";
				String database = node.has("database") ? node.get("database").asText() : "";
				String username = node.has("username") ? node.get("username").asText() : "";
				String password = node.has("password") ? node.get("password").asText() : "";

				if (host.isEmpty() || database.isEmpty()) {
					System.err.println("⚠️ Configuración incompleta en db-config.json. Usando valores internos.");
					return;
				}

				String url = String.format("jdbc:postgresql://%s:%s/%s", host, port, database);
				
				// Forzar propiedades de Spring Boot sobre las de application.properties
				System.setProperty("spring.datasource.url", url);
				System.setProperty("spring.datasource.username", username);
				System.setProperty("spring.datasource.password", password);
				System.setProperty("spring.datasource.driver-class-name", "org.postgresql.Driver");
				
				// Asegurar dialecto para Postgres
				System.setProperty("spring.jpa.database-platform", "org.hibernate.dialect.PostgreSQLDialect");
				
				System.out.println("✅ REUBICACIÓN DE BASE DE DATOS EXITOSA");
				System.out.println("   URL: " + url);
				System.out.println("   Usuario: " + username);
			} catch (Exception e) {
				System.err.println("❌ ERROR FATAL cargando configuración externa: " + e.getMessage());
				e.printStackTrace();
			}
		} else {
			System.out.println("ℹ️ Iniciando con configuración interna (application.properties)");
		}
	}
}
