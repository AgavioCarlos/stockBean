package com.stockbean.stockapp.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.stockbean.stockapp.dto.RegistroRequest;
import com.stockbean.stockapp.model.tablas.Persona;
import com.stockbean.stockapp.model.tablas.Usuario;
import com.stockbean.stockapp.repository.PersonaRepository;
import com.stockbean.stockapp.repository.UsuarioRepository;
import jakarta.transaction.Transactional;

@Service 
public class RegistroService {
    @Autowired
    private PersonaRepository personaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder  passwordEncoder;

    @Transactional
    public String registrar(RegistroRequest request){
        if(personaRepository.existsByEmail(request.getEmail())){
            return "El correo ya está registrado.";
        }

        Persona persona = new Persona();
        persona.setNombre(request.getNombre());
        persona.setApellido_paterno(request.getApellido_paterno());
        persona.setApellido_materno(request.getApellido_materno());
        persona.setEmail(request.getEmail());
        persona.setFecha_alta(LocalDateTime.now());
        persona.setFecha_ultima_modificacion(LocalDateTime.now());
        persona.setStatus(true);
        personaRepository.save(persona);

        Usuario usuario = new Usuario();
        usuario.setCuenta(request.getCuenta());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setPersona(persona);
        usuario.setId_rol(1); //Administrador
        usuario.setFecha_alta(LocalDateTime.now());
        usuario.setFecha_ultima_modificacion(LocalDateTime.now());
        usuario.setStatus(true);
        usuarioRepository.save(usuario);

        return "Registro exitoso";
    }
}
