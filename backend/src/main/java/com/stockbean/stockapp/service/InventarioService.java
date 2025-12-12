package com.stockbean.stockapp.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stockbean.stockapp.model.tablas.Inventario;
import com.stockbean.stockapp.repository.InventarioRepository;

@Service
public class InventarioService {

    @Autowired
    private InventarioRepository inventarioRepository;

    public List<Inventario> listarTodos() {
        return inventarioRepository.findAll();
    }

    public Inventario guardar(Inventario inventario) {
        return inventarioRepository.save(inventario);
    }

    public Optional<Inventario> obtenerPorId(Integer id) {
        return inventarioRepository.findById(id);
    }

    public void eliminar(Integer id) {
        Optional<Inventario> optionalInventario = inventarioRepository.findById(id);
        if (optionalInventario.isPresent()) {
            Inventario inventario = optionalInventario.get();
            inventario.setStatus(false);
            inventario.setFechaBaja(LocalDateTime.now());
            inventarioRepository.save(inventario);
        }
    }
}
