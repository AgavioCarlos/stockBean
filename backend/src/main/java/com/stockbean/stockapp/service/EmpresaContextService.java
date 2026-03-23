package com.stockbean.stockapp.service;

import com.stockbean.stockapp.model.tablas.Usuario;
import com.stockbean.stockapp.repository.EmpresaUsuarioRepository;
import com.stockbean.stockapp.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

/**
 * Servicio para centralizar el contexto de Empresa y Usuario.
 * Ayuda a implementar Multi-tenancy de forma consistente.
 */
@Service
public class EmpresaContextService {
    
    private final EmpresaUsuarioRepository empresaUsuarioRepository;
    private final UsuarioRepository usuarioRepository;

    public EmpresaContextService(EmpresaUsuarioRepository empresaUsuarioRepository, 
                                 UsuarioRepository usuarioRepository) {
        this.empresaUsuarioRepository = empresaUsuarioRepository;
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * Obtiene el ID de la empresa del usuario.
     * @throws RuntimeException si el usuario no tiene empresa asignada.
     */
    public Integer getEmpresaId(Integer idUsuario) {
        List<Integer> ids = empresaUsuarioRepository.findIdEmpresaByUsuarioId(idUsuario);
        if (ids.isEmpty()) {
            // Verificar si es SISTEM (Súper Admin) - ellos no suelen estar amarrados a una empresa
            Usuario usr = getUsuario(idUsuario);
            if (isSistemas(usr)) {
                return null; // SISTEM tiene acceso global
            }
            throw new RuntimeException("El usuario no tiene una empresa asignada o activa.");
        }
        return ids.get(0);
    }

    /**
     * Obtiene la entidad Usuario por ID.
     */
    public Usuario getUsuario(Integer idUsuario) {
        return usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + idUsuario));
    }

    /**
     * Determina si el usuario es del rol SISTEM (Súper Administrador).
     */
    public boolean isSistemas(Usuario usuario) {
        return "SISTEM".equalsIgnoreCase(usuario.getNombre_rol());
    }

    /**
     * Obtiene el ID de empresa o null si es SISTEM.
     * Útil para filtrar consultas JPA opcionalmente.
     */
    public Optional<Integer> getOptionalEmpresaId(Integer idUsuario) {
        Usuario usr = getUsuario(idUsuario);
        if (isSistemas(usr)) return Optional.empty();
        
        List<Integer> ids = empresaUsuarioRepository.findIdEmpresaByUsuarioId(idUsuario);
        return ids.isEmpty() ? Optional.empty() : Optional.of(ids.get(0));
    }
}
