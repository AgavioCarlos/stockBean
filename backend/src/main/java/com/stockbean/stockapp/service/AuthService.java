package com.stockbean.stockapp.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.stockbean.stockapp.dto.EmpresaUsuarioDTO;
import com.stockbean.stockapp.dto.RegistroRequest;
import com.stockbean.stockapp.model.admin.AdminUsuarioPantalla;
import com.stockbean.stockapp.model.tablas.Suscripcion;
import com.stockbean.stockapp.model.tablas.Usuario;
import com.stockbean.stockapp.repository.UsuarioPantallaRepository;
import com.stockbean.stockapp.repository.EmpresaUsuarioRepository;
import com.stockbean.stockapp.repository.SuscripcionRepository;
import com.stockbean.stockapp.security.JwtUtil;

/**
 * Servicio de autenticación.
 * Contiene la lógica de negocio de login, registro y refresh de token.
 */
@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private EmpresaUsuarioService empresaUsuarioService;

    @Autowired
    private RegistroService registroService;

    @Autowired
    private SuscripcionRepository suscripcionRepository;

    @Autowired
    private UsuarioPantallaRepository adminUsuarioPantallaRepository;

    @Autowired
    private EmpresaUsuarioRepository empresaUsuarioRepository;

    // ============================================
    // Resultado interno para login
    // ============================================
    public static class LoginResult {
        private final boolean success;
        private final int httpStatus; // 200, 401, 402, 500
        private final Map<String, Object> body;

        public LoginResult(boolean success, int httpStatus, Map<String, Object> body) {
            this.success = success;
            this.httpStatus = httpStatus;
            this.body = body;
        }

        public boolean isSuccess() {
            return success;
        }

        public int getHttpStatus() {
            return httpStatus;
        }

        public Map<String, Object> getBody() {
            return body;
        }
    }

    // ============================================
    // Registro
    // ============================================
    public void registrar(RegistroRequest request) {
        registroService.registrar(request);
    }

    // ============================================
    // Login
    // ============================================
    public LoginResult login(String cuenta, String password) {
        // 1. Verificar si el usuario existe
        Usuario user = usuarioService.findByCuenta(cuenta);
        if (user == null) {
            return errorResult(401, "El usuario no existe");
        }

        // 2. Autenticar con Spring Security
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(cuenta, password));
        } catch (BadCredentialsException e) {
            return errorResult(401, "Contraseña incorrecta");
        } catch (Exception e) {
            return errorResult(500, "Error de autenticación");
        }

        // 3. Validar suscripción
        LoginResult suscripcionCheck = validarSuscripcion(user);
        if (suscripcionCheck != null) {
            return suscripcionCheck;
        }

        // 4. Cargar UserDetails y generar JWT
        final UserDetails userDetails = userDetailsService.loadUserByUsername(cuenta);
        List<EmpresaUsuarioDTO> empresaUsuario = empresaUsuarioService.validarEmpresaUsuario(user.getId_usuario());
        final String jwt = jwtUtil.generateToken(userDetails, user.getId_usuario(), user.getId_rol(),
                user.getNombre_rol());

        // 5. Construir permisos CRUD desde admin_usuario_pantalla
        Map<Integer, Map<String, List<String>>> permisosCrud = construirPermisosCrud(user);

        // 6. Armar respuesta
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("success", true);
        respuesta.put("mensaje", "Autenticación exitosa");
        respuesta.put("token", jwt);
        respuesta.put("empresa", empresaUsuario);
        respuesta.put("permisos_crud", permisosCrud);

        // Datos del Usuario
        respuesta.put("id_usuario", user.getId_usuario());
        respuesta.put("cuenta", user.getCuenta());
        respuesta.put("id_rol", user.getId_rol());
        respuesta.put("fecha_alta", user.getFecha_alta());

        // Datos de la Persona asociada
        if (user.getPersona() != null) {
            respuesta.put("id_persona", user.getPersona().getId_persona());
            respuesta.put("nombre", user.getPersona().getNombre());
            respuesta.put("apellido_paterno", user.getPersona().getApellido_paterno());
            respuesta.put("apellido_materno", user.getPersona().getApellido_materno());
            respuesta.put("email", user.getPersona().getEmail());
            respuesta.put("status", user.getPersona().getStatus());
        }

        return new LoginResult(true, 200, respuesta);
    }

    // ============================================
    // Refresh Token
    // ============================================
    public LoginResult refreshToken(String token) {
        try {
            String username = jwtUtil.extractUsername(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtUtil.validateToken(token, userDetails)) {
                Usuario user = usuarioService.findByCuenta(username);
                String newToken = jwtUtil.generateToken(userDetails, user.getId_usuario(), user.getId_rol(),
                        user.getNombre_rol());

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("token", newToken);
                response.put("mensaje", "Token refrescado correctamente");

                System.out.println("✅ Token refrescado para usuario: " + username + ", id_rol: " + user.getId_rol());
                return new LoginResult(true, 200, response);
            } else {
                System.out.println("⚠️ Token inválido o expirado para usuario: " + username);
                return errorResult(401, "Token inválido o expirado");
            }
        } catch (Exception e) {
            System.err.println("❌ Error al procesar el token: " + e.getMessage());
            e.printStackTrace();
            return errorResult(401, "Error al procesar el token: " + e.getMessage());
        }
    }

    // ============================================
    // Métodos privados
    // ============================================

    private LoginResult validarSuscripcion(Usuario user) {
        Suscripcion suscripcion = suscripcionRepository
                .findTopByUsuarioOrderByFechaInicioDesc(user);

        if (suscripcion != null) {
            LocalDateTime now = LocalDateTime.now();
            if (suscripcion.getFechaFin() != null && now.isAfter(suscripcion.getFechaFin())) {
                return errorResult(402, "Suscripción vencida");
            } else if (!Boolean.TRUE.equals(suscripcion.getStatus())) {
                return errorResult(402, "Suscripción inactiva");
            }
        } else if (user.getId_rol() != 1) {
            return errorResult(402, "No tienes una suscripción activa");
        }

        return null; // Suscripción válida
    }

    /**
     * Construye el mapa de permisos CRUD desde admin_usuario_pantalla.
     * Para TODOS los roles (incluido Sistemas).
     */
    private Map<Integer, Map<String, List<String>>> construirPermisosCrud(Usuario user) {
        List<Integer> idsEmpresas = empresaUsuarioRepository.findIdEmpresaByUsuarioId(user.getId_usuario());
        Map<Integer, Map<String, List<String>>> permisosCrud = new HashMap<>();

        for (Integer idEmpresa : idsEmpresas) {
            Map<String, List<String>> permisosPorPantalla = obtenerPermisosDeUsuario(user.getId_usuario(), idEmpresa);
            permisosCrud.put(idEmpresa, permisosPorPantalla);
        }

        // Si no tiene empresas (ej. Sistemas sin empresa) asignar dummy 0
        if (idsEmpresas.isEmpty()) {
            List<AdminUsuarioPantalla> acciones = adminUsuarioPantallaRepository
                    .findByUsuarioId(user.getId_usuario());
            Map<String, List<String>> permisosPorPantalla = mapearPermisos(acciones);
            permisosCrud.put(0, permisosPorPantalla);
        }

        return permisosCrud;
    }

    private Map<String, List<String>> obtenerPermisosDeUsuario(Integer idUsuario, Integer idEmpresa) {
        log.info("AuthService - obtenerPermisosDeUsuario: idUsuario={}, idEmpresa={}", idUsuario, idEmpresa);
        List<AdminUsuarioPantalla> acciones = adminUsuarioPantallaRepository
                .findByUsuarioIdAndEmpresaId(idUsuario, idEmpresa);
        log.info("AuthService - Encontrados {} registros en admin_usuario_pantalla", acciones.size());
        Map<String, List<String>> permisos = mapearPermisos(acciones);
        log.info("AuthService - Permisos mapeados resultantes: {}", permisos);
        return permisos;
    }

    private Map<String, List<String>> mapearPermisos(List<AdminUsuarioPantalla> acciones) {
        Map<String, List<String>> permisosPorPantalla = new HashMap<>();

        for (AdminUsuarioPantalla ua : acciones) {
            if (ua.getPantalla() == null)
                continue;
            String keyPantalla = ua.getPantalla().getNombre().toLowerCase();

            permisosPorPantalla.putIfAbsent(keyPantalla, new ArrayList<>());

            if (Boolean.TRUE.equals(ua.getVer()))
                permisosPorPantalla.get(keyPantalla).add("ver");
            if (Boolean.TRUE.equals(ua.getGuardar()))
                permisosPorPantalla.get(keyPantalla).add("guardar");
            if (Boolean.TRUE.equals(ua.getActualizar()))
                permisosPorPantalla.get(keyPantalla).add("actualizar");
            if (Boolean.TRUE.equals(ua.getEliminar()))
                permisosPorPantalla.get(keyPantalla).add("eliminar");
            log.info("AuthService - mapearPermisos: Pantalla '{}' -> {}", keyPantalla,
                    permisosPorPantalla.get(keyPantalla));
        }

        return permisosPorPantalla;
    }

    private LoginResult errorResult(int httpStatus, String mensaje) {
        Map<String, Object> body = new HashMap<>();
        body.put("success", false);
        body.put("mensaje", mensaje);
        return new LoginResult(false, httpStatus, body);
    }
}
