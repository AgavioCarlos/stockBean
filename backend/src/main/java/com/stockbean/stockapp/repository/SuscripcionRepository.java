package com.stockbean.stockapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.stockbean.stockapp.model.tablas.Suscripcion;
import com.stockbean.stockapp.model.tablas.Usuario;

import org.springframework.data.jpa.repository.Query;

@Repository
public interface SuscripcionRepository extends JpaRepository<Suscripcion, Integer> {
    Suscripcion findTopByUsuarioOrderByFechaInicioDesc(Usuario usuario);
}
