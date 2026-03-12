package com.stockbean.stockapp.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.stockbean.stockapp.model.admin.Pantallas;

public interface PantallaRepository extends JpaRepository<Pantallas, Integer> {

    /**
     * Pantallas ROOT (esRoot = true) - solo para usuario Sistemas (rol 1)
     */
    @Query("SELECT p FROM Pantallas p WHERE p.status = true AND p.esRoot = true ORDER BY p.orden")
    List<Pantallas> findAllRoot();

    /**
     * Pantallas NO ROOT (esRoot IS NULL o esRoot = false) - para roles distintos de
     * Sistemas
     */
    @Query("SELECT p FROM Pantallas p WHERE p.status = true AND (p.esRoot IS NULL OR p.esRoot = false) ORDER BY p.orden")
    List<Pantallas> findAllNoRoot();

    /**
     * Todas las pantallas activas (sin filtro de esRoot)
     */
    @Query("SELECT p FROM Pantallas p WHERE p.status = true ORDER BY p.orden")
    List<Pantallas> findAllActivas();
}
