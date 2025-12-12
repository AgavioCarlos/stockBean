package com.stockbean.stockapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.stockbean.stockapp.model.tablas.HistorialPrecios;
import com.stockbean.stockapp.repository.HistorialPreciosRepository;
import java.util.Objects;

@Service
public class HistorialPreciosServices {
    @Autowired
    private HistorialPreciosRepository historialPreciosRepository;

    public List<HistorialPrecios> listarActuales() {
        return historialPreciosRepository.findCurrentPrices();
    }

    public List<HistorialPrecios> listarHistoricosId(Integer id) {
        return historialPreciosRepository.findHistorialPreciosById(id);
    }

    public List<HistorialPrecios> listarTodos() {
        return historialPreciosRepository.findAll();
    }

    public HistorialPrecios guardar(HistorialPrecios historialPrecios) {
        Objects.requireNonNull(historialPrecios, "El objeto HistorialPrecios no puede ser null.");

        try {
            return historialPreciosRepository.save(historialPrecios);
        } catch (Exception e) {
            throw new RuntimeException("Error al guardar el historial de precios en la base de datos.", e);
        }
    }

    public HistorialPrecios obtenerPorId(Integer id) {
        Objects.requireNonNull(id, "El id no puede ser null.");
        return historialPreciosRepository.findById(id).orElse(null);
    }

    public void eliminar(Integer id) {
        Objects.requireNonNull(id, "El id no puede ser null.");
        historialPreciosRepository.deleteById(id);
    }
}
