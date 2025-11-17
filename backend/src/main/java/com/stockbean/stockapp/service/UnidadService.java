package com.stockbean.stockapp.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stockbean.stockapp.model.catalogos.Unidad;
import com.stockbean.stockapp.repository.UnidadRepository;

@Service
public class UnidadService {
    @Autowired
    private UnidadRepository unidadRepository;

    public List<Unidad> listarTodos(){
        return unidadRepository.findAll();
    }

    public Unidad obtenerPorId(Integer id){
        return unidadRepository.findById(id).orElse(null); 
    }

    public Unidad guardar(Unidad unidades){
        unidades.setFechaAlta(LocalDateTime.now());
        unidades.setFechaUltimaModificacion(LocalDateTime.now());
        return unidadRepository.save(unidades);
    }

    public Unidad actualizar(Integer id, Unidad unidadActualizada){
        Unidad unidades = obtenerPorId(id); 
        if(unidades == null) return null; 
        unidades.setNombre(unidadActualizada.getNombre());
        unidades.setAbreviatura(unidadActualizada.getAbreviatura());
        unidades.setFechaUltimaModificacion(LocalDateTime.now());
        return unidadRepository.save(unidades);
    }
    
}
