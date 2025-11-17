package com.stockbean.stockapp.service;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.stockbean.stockapp.dto.LoginRequest;
import com.stockbean.stockapp.dto.LoginResponse;
import com.stockbean.stockapp.model.catalogos.Rol;
import com.stockbean.stockapp.model.tablas.Usuario;
import com.stockbean.stockapp.repository.RolRepository;
import com.stockbean.stockapp.repository.UsuarioRepository;

@Service
public class LoginService implements UserDetailsService { // <-- Implements UserDetailsService
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    // Inyectamos el repositorio de roles para poder buscar el rol del usuario.
    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // This is the method Spring Security will call for authentication
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByCuenta(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con la cuenta: " + username));

        // Buscamos el rol del usuario para agregarlo a sus permisos (authorities).
        Rol rol = rolRepository.findById(usuario.getId_rol())
                .orElseThrow(() -> new UsernameNotFoundException("Rol no encontrado para el usuario: " + username));

        // Creamos la autoridad. Spring Security suele esperar el formato "ROLE_NOMBRE".
        // Ejemplo: "ROLE_ADMINISTRADOR"
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + rol.getNombre().toUpperCase());

        // Devolvemos el objeto User de Spring Security con su permiso.
        return new User(usuario.getCuenta(), usuario.getPassword(), Collections.singletonList(authority));
    }

    /**
     * This method is part of your original custom login logic. 
     * It is NOT used by the current Spring Security setup but is kept here.
     * The active /login endpoint uses the loadUserByUsername method above.
     */
    public LoginResponse login(LoginRequest request) {
        if(request.getCuenta() == null || request.getCuenta().isEmpty()) {
            return new LoginResponse("Cuenta vacía"); 
        }

        return usuarioRepository.findByCuenta(request.getCuenta())
            .map(usuario -> {
                if (passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
                    return new LoginResponse("Login exitoso");
                } else {
                    return new LoginResponse("Contraseña incorrecta");
                }
            })
            .orElse(new LoginResponse("Usuario no encontrado"));
    }
}
