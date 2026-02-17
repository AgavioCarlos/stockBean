package com.stockbean.stockapp.service;


import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.stockbean.stockapp.model.catalogos.Categoria;
import com.stockbean.stockapp.repository.CategoriaRepository;

import lombok.NonNull;

@Service
public class CategoriaService {
    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<Categoria> listarTodas(){
        return categoriaRepository.findAll();
    }

    public Categoria obtenerPorId(@NonNull Integer id){
        return categoriaRepository.findById(id).orElse( null);  
    }

    public Categoria guardar(Categoria categoria){
        categoria.setFechaAlta(LocalDateTime.now());
        categoria.setFechaUltimaModificacion(LocalDateTime.now());
        categoria.setStatus(true);

        return categoriaRepository.save(categoria);
    }

    public Categoria actualizar(Integer id, Categoria categoriaActualizada){
        Categoria categoria = obtenerPorId(id);

        if(categoria == null) return null;

        categoria.setNombre(categoriaActualizada.getNombre());
        categoria.setFechaUltimaModificacion(LocalDateTime.now());
        return categoriaRepository.save(categoria);
    }

    public void eliminar(Integer id){
        Categoria categoria = obtenerPorId(id);
        if(categoria != null){
            categoria.setStatus(false);
            categoria.setFechaBaja(LocalDateTime.now());
            categoria.setFechaUltimaModificacion(LocalDateTime.now());

            categoriaRepository.save(categoria);
        }
    }
}
