package com.stockbean.stockapp.exception;

/**
 * Excepción de dominio para errores de lógica de negocio.
 * Se mapea a HTTP 422 (Unprocessable Entity) por el GlobalExceptionHandler.
 */
public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }

    public BusinessException(String message, Throwable cause) {
        super(message, cause);
    }
}
