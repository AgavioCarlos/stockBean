package com.stockbean.stockapp.service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.stockbean.stockapp.dto.EmpresaUsuarioDTO;
import com.stockbean.stockapp.model.admin.Empresa;
import com.stockbean.stockapp.repository.EmpresaRepository;
import com.stockbean.stockapp.repository.EmpresaUsuarioRepository;
import com.stockbean.stockapp.repository.UsuarioRepository;
import com.stockbean.stockapp.model.admin.EmpresaUsuario;
import com.stockbean.stockapp.model.tablas.Usuario;
import org.springframework.lang.NonNull;
import org.springframework.transaction.annotation.Transactional;

import com.stockbean.stockapp.model.admin.AdminUsuarioPantalla;
import com.stockbean.stockapp.model.admin.Pantallas;
import com.stockbean.stockapp.repository.PantallaRepository;
import com.stockbean.stockapp.repository.UsuarioPantallaRepository;

@Service
public class EmpresaService {
    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EmpresaUsuarioRepository empresaUsuarioRepository;

    @Autowired
    private PantallaRepository pantallaRepository;

    @Autowired
    private UsuarioPantallaRepository usuarioPantallaRepository;

    public List<Empresa> listarTodos() {
        return empresaRepository.findAll();
    }

    public Empresa obtenerPorId(@NonNull Integer id) {
        return empresaRepository.findById(id).orElseThrow(() -> new RuntimeException("No encontrado con id: " + id));
    }

    public Empresa guardar(Empresa empresa) {
        empresa.setFechaCreacion(LocalDateTime.now());
        empresa.setActivo(true);
        return empresaRepository.save(empresa);
    }

    public Empresa actualizar(@NonNull Integer id, Empresa empresaActualizado) {
        Empresa empresa = obtenerPorId(id);
        empresa.setRazonSocial(empresaActualizado.getRazonSocial());
        empresa.setNombreComercial(empresaActualizado.getNombreComercial());
        empresa.setRfc(empresaActualizado.getRfc());
        empresa.setActivo(empresaActualizado.getActivo());
        empresa.setFechaCreacion(empresaActualizado.getFechaCreacion());
        return empresaRepository.save(empresa);
    }

    public void eliminar(@NonNull Integer id) {
        Empresa empresa = obtenerPorId(id);
        if (empresa != null) {
            empresa.setActivo(false);
            empresaRepository.save(empresa);
        }
    }

    public List<EmpresaUsuarioDTO> obtenerEmpresasPorUsuario(@NonNull Integer idEmpresa) {
        return empresaRepository.findEmpresasUsuariosId(idEmpresa);
    }

    /**
     * Configura la empresa del usuario (primer uso después del registro).
     * Además asigna automáticamente todos los permisos CRUD de las pantallas
     * no-root al usuario admin que crea la empresa.
     */
    @Transactional
    public Empresa configurarEmpresa(Empresa empresa, @NonNull Integer idUsuario) {
        empresa.setFechaCreacion(LocalDateTime.now());
        empresa.setActivo(true);
        Empresa empresaGuardada = empresaRepository.save(empresa);

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + idUsuario));

        EmpresaUsuario empresaUsuario = new EmpresaUsuario();
        empresaUsuario.setEmpresa(empresaGuardada);
        empresaUsuario.setUsuario(usuario);
        empresaUsuario.setActivo(true);
        empresaUsuario.setFechaAlta(LocalDateTime.now());

        empresaUsuarioRepository.save(empresaUsuario);

        // ============================================
        // Asignar permisos de todas las pantallas no-root (esRoot != true)
        // con CRUD completo al usuario admin que crea la empresa
        // ============================================
        asignarPermisosAdmin(usuario, empresaGuardada);

        return empresaGuardada;
    }

    /**
     * Asigna todas las pantallas no-root con permisos CRUD completos
     * a un usuario en una empresa.
     */
    private void asignarPermisosAdmin(Usuario usuario, Empresa empresa) {
        List<Pantallas> pantallasNoRoot = pantallaRepository.findAllNoRoot();

        for (Pantallas pantalla : pantallasNoRoot) {
            AdminUsuarioPantalla permiso = new AdminUsuarioPantalla();
            permiso.setUsuario(usuario);
            permiso.setEmpresa(empresa);
            permiso.setPantalla(pantalla);
            permiso.setVer(true);
            permiso.setGuardar(true);
            permiso.setActualizar(true);
            permiso.setEliminar(true);

            usuarioPantallaRepository.save(permiso);
        }

        System.out.println("✅ Asignados permisos CRUD de " + pantallasNoRoot.size()
                + " pantallas al usuario " + usuario.getId_usuario()
                + " en empresa " + empresa.getIdEmpresa());
    }

    public Empresa getFirstActive() {
        return empresaRepository.findAll().stream()
                .filter(Empresa::getActivo)
                .findFirst()
                .orElse(null);
    }
}
