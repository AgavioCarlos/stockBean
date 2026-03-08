package com.stockbean.stockapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stockbean.stockapp.model.catalogos.TipoPrecio;
import com.stockbean.stockapp.service.TipoPrecioService;

@RestController
@RequestMapping("/tipos-precio")
public class TipoPrecioController {

    @Autowired
    private TipoPrecioService tipoPrecioService;

    @GetMapping
    public ResponseEntity<List<TipoPrecio>> listarTodos() {
        return ResponseEntity.ok(tipoPrecioService.listarTodos());
    }
}
