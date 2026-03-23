package com.stockbean.stockapp.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.persistence.EntityNotFoundException;

/**
 * Manejador global de excepciones para toda la API REST.
 * Convierte excepciones en respuestas HTTP semánticas y consistentes.
 *
 * Mapeo de excepciones:
 *  - EntityNotFoundException   → 404 NOT FOUND
 *  - SecurityException         → 403 FORBIDDEN
 *  - BusinessException         → 422 UNPROCESSABLE ENTITY
 *  - IllegalArgumentException  → 400 BAD REQUEST
 *  - RuntimeException genérico → 500 INTERNAL SERVER ERROR
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNotFound(EntityNotFoundException ex) {
        log.warn("Recurso no encontrado: {}", ex.getMessage());
        return new ErrorResponse("NOT_FOUND", ex.getMessage());
    }

    @ExceptionHandler(SecurityException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorResponse handleForbidden(SecurityException ex) {
        log.warn("Acceso denegado: {}", ex.getMessage());
        return new ErrorResponse("FORBIDDEN", ex.getMessage());
    }

    @ExceptionHandler(BusinessException.class)
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    public ErrorResponse handleBusiness(BusinessException ex) {
        log.warn("Error de negocio: {}", ex.getMessage());
        return new ErrorResponse("BUSINESS_ERROR", ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleBadRequest(IllegalArgumentException ex) {
        log.warn("Argumento inválido: {}", ex.getMessage());
        return new ErrorResponse("BAD_REQUEST", ex.getMessage());
    }

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleRuntime(RuntimeException ex) {
        log.error("Error interno del servidor: {}", ex.getMessage(), ex);
        return new ErrorResponse("INTERNAL_ERROR", ex.getMessage());
    }
}
