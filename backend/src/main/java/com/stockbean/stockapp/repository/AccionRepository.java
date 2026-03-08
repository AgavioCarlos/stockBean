package com.stockbean.stockapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.stockbean.stockapp.model.catalogos.Accion;

@Repository
public interface AccionRepository extends JpaRepository<Accion, Integer> {

    List<Accion> findByStatusTrue();
}
