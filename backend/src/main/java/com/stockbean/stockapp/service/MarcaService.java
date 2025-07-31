package com.stockbean.stockapp.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stockbean.stockapp.model.catalogos.Marca;
import com.stockbean.stockapp.repository.MarcaRepository;

@Service
public class MarcaService {
    @Autowired
    private MarcaRepository marcaRepository;

    public List<Marca> listarTodas(){
        return marcaRepository.findAll();
    }

    public Marca obtenerPorId(Integer id){
        return marcaRepository.findById(id).orElse(null);  
    }

    public Marca guardar(Marca marca){
        marca.setFecha_alta(LocalDateTime.now());
        marca.setFecha_ultima_modificacion(LocalDateTime.now());
        marca.setStatus(true);
        
        return marcaRepository.save(marca);
    }

    public Marca actualizar(Integer id, Marca marcaActualizada){
        Marca marca = obtenerPorId(id);
        if(marca == null) return null;

        marca.setNombre(marcaActualizada.getNombre());
        marca.setFecha_ultima_modificacion(marcaActualizada.getFecha_ultima_modificacion());
        return marcaRepository.save(marca);
    }

    public void eliminar(Integer id){
        Marca marca = obtenerPorId(id);
        if(marca != null) {
            marca.setStatus(false);
            marca.setFecha_baja(LocalDateTime.now());
            marca.setFecha_ultima_modificacion(LocalDateTime.now());
            marcaRepository.save(marca);
        }
    }
    
}
