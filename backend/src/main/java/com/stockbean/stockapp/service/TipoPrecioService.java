package com.stockbean.stockapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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

    public TipoPrecio obtenerPorId(Integer id) {
        return tipoPrecioRepository.findById(id).orElse(null);
    }
}
