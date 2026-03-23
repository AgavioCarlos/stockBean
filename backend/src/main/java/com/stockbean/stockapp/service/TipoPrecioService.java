package com.stockbean.stockapp.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import com.stockbean.stockapp.model.catalogos.TipoPrecio;
import com.stockbean.stockapp.repository.TipoPrecioRepository;

@Service
public class TipoPrecioService {
    @Autowired
    private TipoPrecioRepository tipoPrecioRepository;

    public List<TipoPrecio> listarTodos() {
        return tipoPrecioRepository.findAll();
    }

    public TipoPrecio obtenerPorId(@NonNull Integer id) {
        return tipoPrecioRepository.findById(id).orElse(null);
    }

    public TipoPrecio guardar(TipoPrecio tipoPrecio) {
        return tipoPrecioRepository.save(tipoPrecio);
    }

    public TipoPrecio actualizar(Integer id, TipoPrecio detalles) {
        TipoPrecio tipoPrecio = obtenerPorId(id);
        if (tipoPrecio != null) {
            tipoPrecio.setNombre(detalles.getNombre());
            tipoPrecio.setDescripcion(detalles.getDescripcion());
            tipoPrecio.setStatus(detalles.getStatus());
            return tipoPrecioRepository.save(tipoPrecio);
        }
        throw new RuntimeException("TipoPrecio no encontrado con id " + id);
    }

    public void eliminar(Integer id) {
        tipoPrecioRepository.deleteById(id);
    }
}
