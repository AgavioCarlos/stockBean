package com.stockbean.stockapp.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Helper class para obtener información del usuario autenticado desde el JWT
 */
@Component
public class AuthHelper {

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Obtiene el token JWT del header Authorization de la petición actual
     */
    private String getJwtFromRequest() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            String authHeader = request.getHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                return authHeader.substring(7);
            }
        }
        return null;
    }

    /**
     * Obtiene el id_rol del usuario autenticado desde el JWT
     * 
     * @return Integer con el id_rol o null si no está disponible
     */
    public Integer getIdRolFromToken() {
        String token = getJwtFromRequest();
        if (token != null) {
            return jwtUtil.extractIdRol(token);
        }
        return null;
    }

    /**
     * Obtiene el username del usuario autenticado desde el JWT
     * 
     * @return String con el username o null si no está disponible
     */
    public String getUsernameFromToken() {
        String token = getJwtFromRequest();
        if (token != null) {
            return jwtUtil.extractUsername(token);
        }
        return null;
    }
}
