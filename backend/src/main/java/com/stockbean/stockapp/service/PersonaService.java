package com.stockbean.stockapp.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import com.stockbean.stockapp.model.Persona;
import com.stockbean.stockapp.repository.PersonaRepository; 


@Service
public class PersonaService {
    @Autowired
    private PersonaRepository personaRepository;

    public List<Persona> listarTodas() {
        return personaRepository.findAll();
    }

    public Persona obtenerPorId(Integer id){
        return personaRepository.findById(id).orElse(null);
    }

    public Persona guardar (Persona persona) {
        persona.setFecha_alta(LocalDateTime.now());
        persona.setFecha_ultima_modificacion(LocalDateTime.now());
        persona.setStatus(true);
        return personaRepository.save(persona);
    }

    public Persona actualizar(Integer id, Persona personaActualizada){
        Persona persona = obtenerPorId(id);
        if(persona == null) return null;
        persona.setNombre(personaActualizada.getNombre());
        persona.setApellido_paterno(personaActualizada.getApellido_paterno());
        persona.setApellido_materno(personaActualizada.getApellido_materno());
        persona.setEmail(personaActualizada.getEmail());
        persona.setStatus(personaActualizada.getStatus());
        persona.setFecha_ultima_modificacion(LocalDateTime.now());
        return personaRepository.save(persona);
    }

    public void eliminar(Integer id){
        Persona persona = obtenerPorId(id);
        if(persona !=null){
            persona.setStatus(false);
            persona.setFecha_baja(LocalDateTime.now());
            persona.setFecha_ultima_modificacion(LocalDateTime.now());
            personaRepository.save(persona);
        }
    }
    
}
