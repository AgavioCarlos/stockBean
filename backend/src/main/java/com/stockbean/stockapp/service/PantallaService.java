package com.stockbean.stockapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stockbean.stockapp.dto.PantallaDTO;
import com.stockbean.stockapp.repository.PantallaRepository;

@Service
public class PantallaService {

    @Autowired
    private PantallaRepository pantallaRepository;

    public List<PantallaDTO> findByIdPantalla(Integer idRol) {
        return pantallaRepository.findByIdPantalla(idRol);
    }

}
