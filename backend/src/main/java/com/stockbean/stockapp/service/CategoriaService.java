package com.stockbean.stockapp.service;


import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.stockbean.stockapp.model.catalogos.Categoria;
import com.stockbean.stockapp.repository.CategoriaRepository;

@Service
public class CategoriaService {
    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<Categoria> listarTodas(){
        return categoriaRepository.findAll();
    }

    public Categoria obtenerPorId(Integer id){
        return categoriaRepository.findById(id).orElse( null);  
    }

    public Categoria guardar(Categoria categoria){
        categoria.setFecha_alta(LocalDateTime.now());
        categoria.setFecha_ultima_modificacion(LocalDateTime.now());
        categoria.setStatus(true);

        return categoriaRepository.save(categoria);
    }

    public Categoria actualizar(Integer id, Categoria categoriaActualizada){
        Categoria categoria = obtenerPorId(id);

        if(categoria == null) return null;

        categoria.setNombre(categoriaActualizada.getNombre());
        categoria.setFecha_ultima_modificacion(LocalDateTime.now());
        return categoriaRepository.save(categoria);
    }

    public void eliminar(Integer id){
        Categoria categoria = obtenerPorId(id);
        if(categoria != null){
            categoria.setStatus(false);
            categoria.setFecha_baja(LocalDateTime.now());
            categoria.setFecha_ultima_modificacion(LocalDateTime.now());

            categoriaRepository.save(categoria);
        }
    }
}
