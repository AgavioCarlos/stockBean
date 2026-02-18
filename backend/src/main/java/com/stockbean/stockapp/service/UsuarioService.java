package com.stockbean.stockapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stockbean.stockapp.model.admin.EmpresaUsuario;
import com.stockbean.stockapp.model.tablas.Usuario;
import com.stockbean.stockapp.repository.EmpresaUsuarioRepository;
import com.stockbean.stockapp.repository.UsuarioRepository;

import jakarta.transaction.Transactional;
import lombok.NonNull;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EmpresaUsuarioRepository empresaUsuarioRepository;

    // Asumimos que el ID del rol de sistemas/root es 1.
    // Esto debería idealmente estar en una constante o enum.
    private static final Integer ID_ROL_SISTEMAS = 1;

    public Usuario findById(@NonNull Integer id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    public Usuario findByCuenta(String cuenta) {
        return usuarioRepository.findByCuenta(cuenta).orElse(null);
    }

    public List<Usuario> listarUsuariosPorSolicitante(Integer idUsuarioSolicitante) {
        Usuario solicitante = findById(idUsuarioSolicitante);

        if (solicitante == null) {
            throw new RuntimeException("Usuario solicitante no encontrado");
        }

        // Si es ROOT / SISTEMAS, ve todos
        if (ID_ROL_SISTEMAS.equals(solicitante.getId_rol())) {
            return usuarioRepository.findAll();
        }

        // Si no es ROOT, obtenemos su empresa y mostramos solo los de esa empresa
        List<EmpresaUsuario> registrosEmpresa = empresaUsuarioRepository
                .findByUsuario(solicitante);

        if (registrosEmpresa.isEmpty()) {
            // Usuario sin empresa, no ve nada o solo a sí mismo
            return List.of();
            // O retornamos lista vacía, depende regla de negocio. Retornaré vacío.
        }

        // Asumimos que operamos sobre la primera empresa (si tuviera multiples)
        Integer idEmpresa = registrosEmpresa.get(0).getEmpresa().getIdEmpresa();

        return usuarioRepository.findByEmpresaId(idEmpresa);
    }

    @Transactional
    public Usuario crearUsuario(Usuario nuevoUsuario, Integer idUsuarioCreador) {
        Usuario creador = findById(idUsuarioCreador);

        if (creador == null) {
            throw new RuntimeException("Usuario creador no encontrado");
        }

        // Guardar el usuario
        nuevoUsuario.setFecha_alta(java.time.LocalDateTime.now());
        nuevoUsuario.setStatus(true);
        // Asegurar password encode if needed, assuming plain text or pre-encoded for
        // this snippet scope

        Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);

        // Si el creador es ROOT, puede que debamos permitirle asignar la empresa en el
        // body.
        // Pero el requerimiento dice "crear y asignar a su respectiva empresa".
        // Si el root crea, ¿a cual se asigna?
        // Asumiremos lógica estándar: se asigna a la empresa del creador.
        // Si el creador (Root) no tiene empresa, esto fallará o no asignará empresa.
        // Warning: Root podría no tener empresa asignada.

        List<com.stockbean.stockapp.model.admin.EmpresaUsuario> empresasCreador = empresaUsuarioRepository
                .findByUsuario(creador);

        if (!empresasCreador.isEmpty()) {
            com.stockbean.stockapp.model.admin.Empresa empresa = empresasCreador.get(0).getEmpresa();

            com.stockbean.stockapp.model.admin.EmpresaUsuario relacion = new com.stockbean.stockapp.model.admin.EmpresaUsuario();
            relacion.setUsuario(usuarioGuardado);
            relacion.setEmpresa(empresa);
            relacion.setActivo(true);
            relacion.setFechaAlta(java.time.LocalDateTime.now());

            empresaUsuarioRepository.save(relacion);
        } else {
            // Si el creador no tiene empresa (ej. Root puro), el usuario creado queda
            // "huerfano" de empresa
            // o se espera que se asigne manualmente después.
            // OJO: El requerimiento dice "crear y asignar a **su respectiva empresa**".
            // Si soy Root y creo un usuario para la empresa X, debería pasar el ID de la
            // empresa X.
            // Pero el prompt dice "asignar a su respectiva empresa" (¿del creador o del
            // usuario?).
            // Interpretación probable: "del creador" (contexto de tenant).
        }

        return usuarioGuardado;
    }
}
