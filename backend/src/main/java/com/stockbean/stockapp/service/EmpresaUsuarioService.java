package com.stockbean.stockapp.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.stockbean.stockapp.model.admin.EmpresaUsuario;
import com.stockbean.stockapp.repository.EmpresaUsuarioRepository;
import lombok.NonNull;

@Service
public class EmpresaUsuarioService {

    @Autowired
    private EmpresaUsuarioRepository empresaUsuarioRepository;

    public List<EmpresaUsuario> listarTodos() {
        return empresaUsuarioRepository.findAll();
    }

    public EmpresaUsuario obtenerPorId(@NonNull Integer id) {
        return empresaUsuarioRepository.findById(id).orElse(null);
    }

    public EmpresaUsuario guardar(@NonNull EmpresaUsuario empresaUsuario) {
        return empresaUsuarioRepository.save(empresaUsuario);
    }

    public EmpresaUsuario actualizar(Integer id, EmpresaUsuario empresaUsuarioActualizado) {
        EmpresaUsuario empresaUsuario = obtenerPorId(id);
        if (empresaUsuario == null)
            return null;

        empresaUsuario.setEmpresa(empresaUsuarioActualizado.getEmpresa());
        empresaUsuario.setUsuario(empresaUsuarioActualizado.getUsuario());
        empresaUsuario.setActivo(empresaUsuarioActualizado.getActivo());
        return empresaUsuarioRepository.save(empresaUsuario);
    }

    public void eliminar(Integer id) {
        EmpresaUsuario empresaUsuario = obtenerPorId(id);
        if (empresaUsuario != null) {
            empresaUsuario.setActivo(false);
            empresaUsuarioRepository.save(empresaUsuario);
        }
    }

}
