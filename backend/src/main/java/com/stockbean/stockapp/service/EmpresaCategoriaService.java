package com.stockbean.stockapp.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stockbean.stockapp.model.admin.Empresa;
import com.stockbean.stockapp.model.admin.EmpresaCategoria;
import com.stockbean.stockapp.model.catalogos.Categoria;
import com.stockbean.stockapp.repository.CategoriaRepository;
import com.stockbean.stockapp.repository.EmpresaCategoriaRepository;
import com.stockbean.stockapp.repository.EmpresaRepository;

@Service
public class EmpresaCategoriaService {

    @Autowired
    private EmpresaCategoriaRepository empresaCategoriaRepository;

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<Categoria> getCategoriasAsignadas(Integer idEmpresa) {
        return empresaCategoriaRepository.findCategoriasAsignadas(idEmpresa);
    }

    public List<Categoria> getCategoriasDisponibles(Integer idEmpresa) {
        return empresaCategoriaRepository.findCategoriasDisponibles(idEmpresa);
    }

    public Categoria asignarCategoria(Integer idEmpresa, Integer idCategoria) {
        Optional<EmpresaCategoria> existing = empresaCategoriaRepository.findByEmpresa_IdEmpresaAndCategoria_IdCategoria(idEmpresa, idCategoria);
        if (existing.isPresent()) {
            EmpresaCategoria ec = existing.get();
            if (!ec.getStatus()) {
                ec.setStatus(true);
                empresaCategoriaRepository.save(ec);
            }
            return ec.getCategoria();
        }

        Empresa e = empresaRepository.findById(idEmpresa)
            .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));
        Categoria c = categoriaRepository.findById(idCategoria)
            .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        EmpresaCategoria ec = new EmpresaCategoria();
        ec.setEmpresa(e);
        ec.setCategoria(c);
        ec.setStatus(true);
        empresaCategoriaRepository.save(ec);

        return c;
    }

    public void desasignarCategoria(Integer idEmpresa, Integer idCategoria) {
        Optional<EmpresaCategoria> existing = empresaCategoriaRepository.findByEmpresa_IdEmpresaAndCategoria_IdCategoria(idEmpresa, idCategoria);
        if (existing.isPresent()) {
            EmpresaCategoria ec = existing.get();
            ec.setStatus(false);
            empresaCategoriaRepository.save(ec);
        }
    }
}
