package com.stockbean.stockapp.service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.stockbean.stockapp.model.admin.PersonaEmpresa;
import com.stockbean.stockapp.model.tablas.Persona;
import com.stockbean.stockapp.model.tablas.Usuario;
import com.stockbean.stockapp.repository.EmpresaUsuarioRepository;
import com.stockbean.stockapp.repository.PersonaEmpresaRepository;
import com.stockbean.stockapp.repository.PersonaRepository;
import com.stockbean.stockapp.repository.UsuarioRepository;
import lombok.NonNull;

@Service
public class PersonaEmpresaService {

    @Autowired
    private PersonaEmpresaRepository personaEmpresaRepository;

    @Autowired
    private PersonaRepository personaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EmpresaUsuarioRepository empresaUsuarioRepository;

    public List<PersonaEmpresa> listarPorUsuario(@NonNull Integer idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + idUsuario));

        String rol = usuario.getNombre_rol();

        if (rol == null) {
            throw new RuntimeException("El usuario no tiene un rol asignado.");
        }

        // SISTEM: Acceso total a todas las asociaciones (Puede filtrar más tarde si
        // gusta)
        if ("SISTEM".equalsIgnoreCase(rol)) {
            return personaEmpresaRepository.findAll();
        }

        // ADMIN, GERENTE, CAJERO: Solo asociadas a su empresa
        if ("ADMIN".equalsIgnoreCase(rol) || "GERENTE".equalsIgnoreCase(rol) || "CAJERO".equalsIgnoreCase(rol)) {
            List<Integer> companyIds = empresaUsuarioRepository.findIdEmpresaByUsuarioId(idUsuario);
            if (companyIds.isEmpty()) {
                throw new RuntimeException("El usuario no tiene empresa asignada.");
            }
            // Retornamos las personas-empresas de todas las empresas a las que tiene acceso
            // (usualmente una)
            return personaEmpresaRepository.findByEmpresa_IdEmpresaIn(companyIds);
        }

        throw new RuntimeException("Rol de usuario no autorizado (" + rol + ")");
    }

    @Transactional
    public PersonaEmpresa guardar(PersonaEmpresa personaEmpresa, @NonNull Integer idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + idUsuario));

        if (personaEmpresa.getEmpresa() == null || personaEmpresa.getEmpresa().getIdEmpresa() == null) {
            String currRol = usuario.getNombre_rol();
            if (!"SISTEM".equalsIgnoreCase(currRol)) {
                List<Integer> compIds = empresaUsuarioRepository.findIdEmpresaByUsuarioId(idUsuario);
                if (compIds.isEmpty()) {
                    throw new RuntimeException("El usuario no tiene empresa asignada para realizar esta operacion.");
                }
                com.stockbean.stockapp.model.admin.Empresa e = new com.stockbean.stockapp.model.admin.Empresa();
                e.setIdEmpresa(compIds.get(0));
                personaEmpresa.setEmpresa(e);
            } else {
                throw new RuntimeException("Empresa es requerida para asociar a la persona.");
            }
        }

        validarAccesoEmpresa(usuario, personaEmpresa.getEmpresa().getIdEmpresa());

        // Manejo de la persona: GUARDAR si no existe (Transaccional)
        Persona personaInput = personaEmpresa.getPersona();
        if (personaInput != null) {
            if (personaInput.getId_persona() == null) {
                // Es una persona nueva, la creamos primero
                personaInput.setFecha_alta(LocalDateTime.now());
                personaInput.setFecha_ultima_modificacion(LocalDateTime.now());
                personaInput.setStatus(true);
                Persona personaGuardada = personaRepository.save(personaInput);
                personaEmpresa.setPersona(personaGuardada);
            } else {
                // Evitamos sobrescribir otras cosas o validamos si existe
                Persona existente = personaRepository.findById(personaInput.getId_persona())
                        .orElseThrow(() -> new RuntimeException(
                                "Persona con ID " + personaInput.getId_persona() + " no encontrada."));
                personaEmpresa.setPersona(existente);
            }
        }

        if (personaEmpresa.getActivo() == null) {
            personaEmpresa.setActivo(true);
        }

        return personaEmpresaRepository.save(personaEmpresa);
    }

    @Transactional
    public PersonaEmpresa actualizar(Integer id, PersonaEmpresa detalles, @NonNull Integer idUsuario) {
        PersonaEmpresa existente = personaEmpresaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro no encontrado con ID: " + id));

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + idUsuario));

        // Validar acceso a la empresa actual de la relación
        validarAccesoEmpresa(usuario, existente.getEmpresa().getIdEmpresa());

        // Actualizar datos de PersonaEmpresa
        if (detalles.getFechaIngreso() != null) {
            existente.setFechaIngreso(detalles.getFechaIngreso());
        }
        if (detalles.getFechaSalida() != null) {
            existente.setFechaSalida(detalles.getFechaSalida());
        }
        if (detalles.getActivo() != null) {
            existente.setActivo(detalles.getActivo());
        }

        // Actualizar los datos de la Persona si vienen en el payload
        if (detalles.getPersona() != null && existente.getPersona() != null) {
            Persona pExistente = existente.getPersona();
            Persona pActualizado = detalles.getPersona();

            pExistente.setNombre(pActualizado.getNombre() != null ? pActualizado.getNombre() : pExistente.getNombre());
            pExistente
                    .setApellido_paterno(pActualizado.getApellido_paterno() != null ? pActualizado.getApellido_paterno()
                            : pExistente.getApellido_paterno());
            pExistente
                    .setApellido_materno(pActualizado.getApellido_materno() != null ? pActualizado.getApellido_materno()
                            : pExistente.getApellido_materno());
            pExistente.setEmail(pActualizado.getEmail() != null ? pActualizado.getEmail() : pExistente.getEmail());
            if (pActualizado.getStatus() != null) {
                pExistente.setStatus(pActualizado.getStatus());
            }
            pExistente.setFecha_ultima_modificacion(LocalDateTime.now());

            personaRepository.save(pExistente);
        }

        return personaEmpresaRepository.save(existente);
    }

    @Transactional
    public void eliminar(Integer id, @NonNull Integer idUsuario) {
        PersonaEmpresa existente = personaEmpresaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro no encontrado con ID: " + id));

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + idUsuario));

        validarAccesoEmpresa(usuario, existente.getEmpresa().getIdEmpresa());

        // Borrado Lógico en la relación PersonaEmpresa
        existente.setActivo(false);
        personaEmpresaRepository.save(existente);
    }

    private void validarAccesoEmpresa(Usuario usuario, Integer idEmpresa) {
        String rol = usuario.getNombre_rol();

        if (rol == null) {
            throw new RuntimeException("El usuario no tiene un rol asignado.");
        }

        if ("SISTEM".equalsIgnoreCase(rol)) {
            return;
        }

        List<Integer> companyIds = empresaUsuarioRepository.findIdEmpresaByUsuarioId(usuario.getId_usuario());
        if ("ADMIN".equalsIgnoreCase(rol) || "GERENTE".equalsIgnoreCase(rol) || "CAJERO".equalsIgnoreCase(rol)) {
            if (companyIds.isEmpty() || !companyIds.contains(idEmpresa)) {
                throw new RuntimeException("Acceso denegado: La empresa no corresponde al usuario.");
            }
            return;
        }

        throw new RuntimeException("Rol de usuario no autorizado");
    }
}
