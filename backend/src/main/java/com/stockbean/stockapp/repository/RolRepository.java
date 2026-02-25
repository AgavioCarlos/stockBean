package com.stockbean.stockapp.repository;

import com.stockbean.stockapp.model.catalogos.Rol;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RolRepository extends JpaRepository<Rol, Integer> {
    List<Rol> findByActivoTrue();
}