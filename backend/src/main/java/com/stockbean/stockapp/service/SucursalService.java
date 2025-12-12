package com.stockbean.stockapp.service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.stockbean.stockapp.model.catalogos.Sucursales;
import com.stockbean.stockapp.repository.SucursalRepository;

@Service
public class SucursalService {

    @Autowired
    private SucursalRepository sucursalRepository;

    public List<Sucursales> listarTodos() {
        return sucursalRepository.findAll();
    }

    public Sucursales guardar(Sucursales sucursal) {
        return sucursalRepository.save(sucursal);
    }

    public Sucursales obtenerPorId(Integer id) {
        return sucursalRepository.findById(id).orElse(null);
    }

    public Sucursales actualizar(Integer id, Sucursales sucursalDetails) {
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
            sucursal.setFechaBaja(LocalDateTime.now());
            sucursalRepository.save(sucursal);
        });
    }
}
