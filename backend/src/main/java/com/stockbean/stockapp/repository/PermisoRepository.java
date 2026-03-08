package com.stockbean.stockapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.stockbean.stockapp.model.catalogos.Permiso;

@Repository
public interface PermisoRepository extends JpaRepository<Permiso, Integer> {
}
