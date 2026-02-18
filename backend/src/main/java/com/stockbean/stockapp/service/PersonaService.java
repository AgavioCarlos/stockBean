package com.stockbean.stockapp.service;

import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import com.stockbean.stockapp.model.tablas.Persona;
import com.stockbean.stockapp.repository.PersonaRepository;

import com.stockbean.stockapp.model.admin.EmpresaUsuario;
import com.stockbean.stockapp.model.tablas.Usuario;
import com.stockbean.stockapp.repository.EmpresaUsuarioRepository;
import com.stockbean.stockapp.repository.UsuarioRepository;
import org.springframework.lang.NonNull;

@Service
public class PersonaService {
    @Autowired
    private PersonaRepository personaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EmpresaUsuarioRepository empresaUsuarioRepository;

    private static final Integer ID_ROL_SISTEMAS = 1;

    public List<Persona> listarTodas() {
        return personaRepository.findAll();
    }

    public List<Persona> listarPersonasPorSolicitante(@NonNull Integer idUsuarioSolicitante) {
        Usuario solicitante = usuarioRepository.findById(idUsuarioSolicitante)
                .orElseThrow(() -> new RuntimeException("Usuario solicitante no encontrado"));

        // Si es ROOT / SISTEMAS, ve todas las personas
        if (ID_ROL_SISTEMAS.equals(solicitante.getId_rol())) {
            return personaRepository.findAll();
        }

        // Si no es ROOT, obtenemos su empresa
        List<Integer> idsEmpresa = empresaUsuarioRepository.findIdEmpresaByUsuarioId(idUsuarioSolicitante);

        if (idsEmpresa.isEmpty()) {
            return List.of();
        }

        Integer idEmpresa = idsEmpresa.get(0); // Take the first one

        return personaRepository.findByEmpresaId(idEmpresa);
    }

    public Persona obtenerPorId(Integer id) {
        return personaRepository.findById(id).orElse(null);
    }

    public Persona guardar(Persona persona) {
        persona.setFecha_alta(LocalDateTime.now());
        persona.setFecha_ultima_modificacion(LocalDateTime.now());
        persona.setStatus(true);
        return personaRepository.save(persona);
    }

    public Persona actualizar(Integer id, Persona personaActualizada) {
        Persona persona = obtenerPorId(id);
        if (persona == null)
            return null;
        persona.setNombre(personaActualizada.getNombre());
        persona.setApellido_paterno(personaActualizada.getApellido_paterno());
        persona.setApellido_materno(personaActualizada.getApellido_materno());
        persona.setEmail(personaActualizada.getEmail());
        persona.setStatus(personaActualizada.getStatus());
        persona.setFecha_ultima_modificacion(LocalDateTime.now());
        return personaRepository.save(persona);
    }

    public void eliminar(Integer id) {
        Persona persona = obtenerPorId(id);
        if (persona != null) {
            persona.setStatus(false);
            persona.setFecha_baja(LocalDateTime.now());
            persona.setFecha_ultima_modificacion(LocalDateTime.now());
            personaRepository.save(persona);
        }
    }

}
