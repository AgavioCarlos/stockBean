package com.stockbean.stockapp.service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.stockbean.stockapp.model.catalogos.Marca;
import com.stockbean.stockapp.repository.MarcaRepository;
import com.stockbean.stockapp.repository.EmpresaUsuarioRepository;

@Service
public class MarcaService {
    @Autowired
    private MarcaRepository marcaRepository;

    @Autowired
    private EmpresaUsuarioRepository empresaUsuarioRepository;

    public List<Marca> listarTodas(Integer idUsuario) {
        List<Integer> companyIds = empresaUsuarioRepository.findIdEmpresaByUsuarioId(idUsuario);
        Integer idEmpresa = companyIds.isEmpty() ? null : companyIds.get(0);

        if (idEmpresa == null)
            return List.of();
        return marcaRepository.findByIdEmpresa(idEmpresa);
    }

    public Marca obtenerPorId(Integer id, Integer idUsuario) {
        List<Integer> companyIds = empresaUsuarioRepository.findIdEmpresaByUsuarioId(idUsuario);
        Integer idEmpresa = companyIds.isEmpty() ? null : companyIds.get(0);

        Marca marca = marcaRepository.findById(id).orElse(null);
        if (marca != null && idEmpresa != null && idEmpresa.equals(marca.getIdEmpresa())) {
            return marca;
        }
        return null;
    }

    public Marca guardar(Marca marca, Integer idUsuario) {
        marca.setFechaAlta(LocalDateTime.now());
        marca.setFechaUltimaModificacion(LocalDateTime.now());
        marca.setStatus(true);

        List<Integer> companyIds = empresaUsuarioRepository.findIdEmpresaByUsuarioId(idUsuario);
        if (!companyIds.isEmpty() && marca.getIdEmpresa() == null) {
            marca.setIdEmpresa(companyIds.get(0));
        }

        return marcaRepository.save(marca);
    }

    public Marca actualizar(Integer id, Marca marcaActualizada, Integer idUsuario) {
        Marca marca = obtenerPorId(id, idUsuario);
        if (marca == null)
            return null;

        marca.setNombre(marcaActualizada.getNombre());
        marca.setStatus(marcaActualizada.getStatus());
        marca.setFechaUltimaModificacion(LocalDateTime.now());
        return marcaRepository.save(marca);
    }

    public void eliminar(Integer id, Integer idUsuario) {
        Marca marca = obtenerPorId(id, idUsuario);
        if (marca != null) {
            marca.setStatus(false);
            marca.setFechaBaja(LocalDateTime.now());
            marca.setFechaUltimaModificacion(LocalDateTime.now());
            marcaRepository.save(marca);
        }
    }
}
