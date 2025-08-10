package com.stockbean.stockapp.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.stockbean.stockapp.model.tablas.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer>{

    Optional<Usuario> findByCuenta(String cuenta);
    
}
