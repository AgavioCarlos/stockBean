package com.stockbean.stockapp.repository;

import com.stockbean.stockapp.model.Persona;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PersonaRepository extends JpaRepository<Persona, Integer>{
    List<Persona> findByStatus(Boolean status);   
}
