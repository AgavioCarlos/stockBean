package com.stockbean.stockapp.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.stockbean.stockapp.dto.RegistroRequest;
import com.stockbean.stockapp.model.catalogos.MetodoPago;
import com.stockbean.stockapp.model.catalogos.Plan;
import com.stockbean.stockapp.model.catalogos.Rol;
import com.stockbean.stockapp.model.tablas.Persona;
import com.stockbean.stockapp.model.tablas.Suscripcion;
import com.stockbean.stockapp.model.tablas.Usuario;
import com.stockbean.stockapp.repository.PersonaRepository;
import com.stockbean.stockapp.repository.RolRepository;
import com.stockbean.stockapp.repository.UsuarioRepository;
import jakarta.transaction.Transactional;

@Service
public class RegistroService {
    @Autowired
    private PersonaRepository personaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private com.stockbean.stockapp.repository.SuscripcionRepository suscripcionRepository;

    @Transactional
    public String registrar(RegistroRequest request) {
        if (personaRepository.existsByEmail(request.getEmail())) {
            return "El correo ya está registrado.";
        }

        Persona persona = new Persona();
        persona.setNombre(request.getNombre());
        persona.setApellido_paterno(request.getApellido_paterno());
        persona.setApellido_materno(request.getApellido_materno());
        persona.setEmail(request.getEmail());
        persona.setFecha_alta(LocalDateTime.now());
        persona.setFecha_ultima_modificacion(LocalDateTime.now());
        persona.setStatus(true);
        personaRepository.save(persona);

        Usuario usuario = new Usuario();
        usuario.setCuenta(request.getCuenta());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setPersona(persona);

        Rol rolAdmin = rolRepository.findById(2)
                .orElseThrow(() -> new RuntimeException("Error: Rol 'Administrador' no encontrado."));
        usuario.setRol(rolAdmin);

        usuario.setFecha_alta(LocalDateTime.now());
        usuario.setFecha_ultima_modificacion(LocalDateTime.now());
        usuario.setStatus(true);
        usuario = usuarioRepository.save(usuario); // Guarda y obtiene el ID

        // Crear la suscripción
        if (request.getId_plan() != null) {
            try {
                Suscripcion suscripcion = new Suscripcion();
                suscripcion.setUsuario(usuario);

                Plan plan = new Plan();
                plan.setId_plan(request.getId_plan());
                suscripcion.setPlan(plan);

                LocalDateTime fechaInicio = LocalDateTime.now();
                suscripcion.setFechaInicio(fechaInicio);
                suscripcion.setFechaFin(fechaInicio.plusMonths(1));
                suscripcion.setStatus(true);

                MetodoPago metodoPago = new MetodoPago();
                metodoPago.setIdMetodoPago(1);
                suscripcion.setMetodoPago(metodoPago);

                String randomString = java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();
                String referenciaPago = "REF-" + usuario.getId_usuario() + "-" + request.getId_plan() + "-" +
                        fechaInicio.format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd")) + "-"
                        + randomString;
                suscripcion.setReferenciaPago(referenciaPago);
                suscripcion.setFechaAlta(fechaInicio);
                suscripcion.setFechaUltimaModificacion(fechaInicio);

                suscripcionRepository.save(suscripcion);
            } catch (Exception e) {
                System.err.println("❌ Error al guardar la suscripción: " + e.getMessage());
                e.printStackTrace();
                throw new RuntimeException("Error al crear la suscripción, verifica que el plan " + request.getId_plan()
                        + " y el metodo de pago 1 existan.");
            }
        }

        return "Registro exitoso";
    }
}
