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

import jakarta.annotation.Nonnull;

import com.stockbean.stockapp.model.admin.EmpresaUsuario;
import com.stockbean.stockapp.model.tablas.Usuario;
import org.springframework.lang.NonNull;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmpresaService {
    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EmpresaUsuarioRepository empresaUsuarioRepository;

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

    @Transactional
    public Empresa configurarEmpresa(Empresa empresa, @Nonnull Integer idUsuario) {
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

        return empresaGuardada;
    }

}
