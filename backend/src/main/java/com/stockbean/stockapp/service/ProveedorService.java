package com.stockbean.stockapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stockbean.stockapp.model.tablas.Proveedor;
import com.stockbean.stockapp.repository.ProveedorRepository;

@Service
public class ProveedorService {
    @Autowired
    private ProveedorRepository proveedorRepository;

    public List<Proveedor> listarTodos(){
        return proveedorRepository.findAll();
    }
    
}
