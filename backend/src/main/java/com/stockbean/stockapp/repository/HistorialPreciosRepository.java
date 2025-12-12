package com.stockbean.stockapp.repository;

import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.stockbean.stockapp.model.tablas.HistorialPrecios;

@Repository
public interface HistorialPreciosRepository extends JpaRepository<HistorialPrecios, Integer> {

    @Query("SELECT hp FROM HistorialPrecios hp " +
            "WHERE hp.fechaCambio IN (SELECT MAX(sub.fechaCambio)" +
            "FROM HistorialPrecios sub GROUP BY sub.producto)")
    List<HistorialPrecios> findCurrentPrices();

    @Query("SELECT hp FROM HistorialPrecios hp WHERE hp.producto = :id")
    List<HistorialPrecios> findHistorialPreciosById(@Param("id") Integer id);

    //Los 10 productos actuales más caros 
    @Query("SELECT hp FROM HistorialPrecios hp WHERE hp.fechaCambio IN (SELECT MAX(sub.fechaCambio)" +
            "FROM HistorialPrecios sub GROUP BY sub.producto) ORDER BY hp.precioNuevo DESC")
    List<HistorialPrecios> findTop10MostExpensiveProducts();

    //Los 10 productos actuales más baratos 
    @Query("SELECT hp FROM HistorialPrecios hp WHERE hp.fechaCambio IN (SELECT MAX(sub.fechaCambio)" +
            "FROM HistorialPrecios sub GROUP BY sub.producto) ORDER BY hp.precioNuevo ASC")
    List<HistorialPrecios> findTop10CheapestProducts();
}
