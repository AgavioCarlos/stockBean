package com.stockbean.stockapp.service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.stockbean.stockapp.model.tablas.Sucursal;
import com.stockbean.stockapp.repository.SucursalRepository;

@Service
public class SucursalService {

    @Autowired
    private SucursalRepository sucursalRepository;

    public List<Sucursal> listarTodos() {
        return sucursalRepository.findAll();
    }

    public Sucursal guardar(Sucursal sucursal) {
        return sucursalRepository.save(sucursal);
    }

    public Sucursal obtenerPorId(Integer id) {
        return sucursalRepository.findById(id).orElse(null);
    }

    public Sucursal actualizar(Integer id, Sucursal sucursalDetails) {
        return sucursalRepository.findById(id).map(sucursal -> {
            sucursal.setNombre(sucursalDetails.getNombre());
            sucursal.setDireccion(sucursalDetails.getDireccion());
            sucursal.setTelefono(sucursalDetails.getTelefono());
            sucursal.setEmail(sucursalDetails.getEmail());
            sucursal.setStatus(sucursalDetails.getStatus());
            return sucursalRepository.save(sucursal);
        }).orElse(null);
    }

    public void eliminar(Integer id) {
        sucursalRepository.findById(id).ifPresent(sucursal -> {
            sucursal.setStatus(false); // Baja lógica
            sucursal.setFecha_baja(LocalDateTime.now());
            sucursalRepository.save(sucursal);
        });
    }
}
