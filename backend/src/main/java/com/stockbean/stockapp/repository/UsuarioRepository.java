package com.stockbean.stockapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.stockbean.stockapp.model.tablas.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer>{
    
}
