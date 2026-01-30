package com.stockbean.stockapp.service;


import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import com.stockbean.stockapp.model.catalogos.Rol;
import com.stockbean.stockapp.repository.RolRepository;
import org.springframework.lang.NonNull;


@Service 
public class RolService {
    @Autowired
    private RolRepository rolRepository;

    public List<Rol> listarTodos() {
        return rolRepository.findAll();
    }

    public Rol obtenerPorId(@NonNull Integer id){
        return rolRepository.findById(id).orElse(null);
    }

    public Rol guardar (Rol rol) {
        rol.setFecha_alta(LocalDateTime.now());
        rol.setFecha_ultima_modificacion(LocalDateTime.now());
        return rolRepository.save(rol);
    }

    public Rol actualizar(@NonNull Integer id, Rol rolActualizado){
        Rol rol = obtenerPorId(id);
        if(rol == null) return null;
        rol.setNombre(rolActualizado.getNombre());
        rol.setDescripcion(rolActualizado.getDescripcion());
        rol.setFecha_ultima_modificacion(LocalDateTime.now());
        return rolRepository.save(rol);
    }

 /*    public void eliminar(Integer id){
        Rol rol = obtenerPorId(id);
        if(rol !=null){
            
        }
    } */

}