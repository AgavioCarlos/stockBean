package com.stockbean.stockapp.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.JwtException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtRequestFilter.class);

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        // ⚠️ Ignorar preflight OPTIONS
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        try {
            // Comprueba si el encabezado de autorización existe y si comienza con "Bearer "
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                jwt = authorizationHeader.substring(7); // Extrae el token (sin "Bearer ")
                username = jwtUtil.extractUsername(jwt);
                logger.debug("Token recibido para usuario: {}", username);
            } else {
                logger.debug("No se encontró Authorization header o no comienza con Bearer");
            }
        } catch (JwtException ex) {
            logger.warn("Error al parsear JWT: {}", ex.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"mensaje\":\"Token inválido o mal formado\"}");
            return;
        } catch (Exception ex) {
            logger.error("Error inesperado extrayendo JWT: {}", ex.getMessage(), ex);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json");
            response.getWriter().write("{\"mensaje\":\"Error al procesar token\"}");
            return;
        }

        // Si se extrajo un nombre de usuario y no hay una autenticación existente en el contexto de seguridad
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

                // Si el token es válido, configura la autenticación en el contexto de Spring Security
                if (jwtUtil.validateToken(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authenticationToken
                            .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    logger.debug("Autenticación establecida para usuario: {}", username);
                } else {
                    logger.warn("Token no válido para el usuario: {}", username);
                }
            } catch (Exception ex) {
                logger.error("Error validando usuario desde token: {}", ex.getMessage(), ex);
                // Si ocurre un error al cargar el usuario, devolvemos 401
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"mensaje\":\"Usuario no encontrado o token inválido\"}");
                return;
            }
        }

        // Continúa con la cadena de filtros
        chain.doFilter(request, response);
    }
}
