package com.stockbean.stockapp.service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.stockbean.stockapp.model.admin.Empresa;
import com.stockbean.stockapp.repository.EmpresaRepository;
import org.springframework.lang.NonNull;

@Service
public class EmpresaService {
    @Autowired
    private EmpresaRepository empresaRepository;

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

}
