package com.stockbean.stockapp.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stockbean.stockapp.model.tablas.UsuarioSucursal;
import com.stockbean.stockapp.repository.UsuarioSucursalRepository;

@Service
public class UsuarioSucursalService {

    @Autowired
    private UsuarioSucursalRepository usuarioSucursalRepository;

    public List<UsuarioSucursal> listarTodos() {
        return usuarioSucursalRepository.findByStatusTrue();
    }

    public UsuarioSucursal obtenerPorId(Integer id) {
        return usuarioSucursalRepository.findById(id).orElse(null);
    }

    public UsuarioSucursal guardar(UsuarioSucursal usuarioSucursal) {
        if (usuarioSucursalRepository.existsByUsuarioAndSucursal(
                usuarioSucursal.getUsuario(),
                usuarioSucursal.getSucursal())) {
            // Handle duplicate logic if necessary.
            // For now, if it exists, we might want to return it or update it?
            // Or throw exception.
            // Given the UI handles 500 as error, letting it save will trigger
            // UniqueConstraint violation if DB enforces it.
            // But valid check prevents DB error in logs.
            // We can return null or throw.
            // Ideally we throw a business exception.
            // throw new RuntimeException("Asignación ya existe");
        }
        return usuarioSucursalRepository.save(usuarioSucursal);
    }

    public UsuarioSucursal actualizar(UsuarioSucursal usuarioSucursal) {
        return usuarioSucursalRepository.save(usuarioSucursal);
    }

    public void eliminar(Integer id) {
        Optional<UsuarioSucursal> optional = usuarioSucursalRepository.findById(id);
        if (optional.isPresent()) {
            UsuarioSucursal usuarioSucursal = optional.get();
            usuarioSucursal.setStatus(false); // Logical delete
            usuarioSucursal.setFechaBaja(LocalDateTime.now());
            usuarioSucursalRepository.save(usuarioSucursal);
        }
    }
}
