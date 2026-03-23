package com.stockbean.stockapp.exception;

import java.time.LocalDateTime;

/**
 * DTO estándar para las respuestas de error de la API.
 * Ejemplo de respuesta:
 * {
 *   "codigo": "NOT_FOUND",
 *   "mensaje": "Producto no encontrado con ID: 99",
 *   "timestamp": "2026-03-20T14:00:00"
 * }
 */
public class ErrorResponse {

    private final String codigo;
    private final String mensaje;
    private final LocalDateTime timestamp;

    public ErrorResponse(String codigo, String mensaje) {
        this.codigo = codigo;
        this.mensaje = mensaje;
        this.timestamp = LocalDateTime.now();
    }

    public String getCodigo() {
        return codigo;
    }

    public String getMensaje() {
        return mensaje;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}
