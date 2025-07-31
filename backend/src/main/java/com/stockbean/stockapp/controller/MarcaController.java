package com.stockbean.stockapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import com.stockbean.stockapp.model.catalogos.Marca;
import com.stockbean.stockapp.service.MarcaService;

@RestController
@RequestMapping("/marcas")
public class MarcaController {

    
    @Autowired
    private MarcaService marcaService;

    @GetMapping
    public List<Marca> listar(){
        return marcaService.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Marca> obtener(@PathVariable Integer id){
        Marca marca = marcaService.obtenerPorId(id);
        return marca != null ? ResponseEntity.ok(marca) : ResponseEntity.notFound().build();
    }

    @PostMapping()
    public Marca crear(@RequestBody Marca marca){
        return marcaService.guardar(marca);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Marca> actualizar(@PathVariable Integer id, @RequestBody Marca marca){
        Marca actualizado = marcaService.actualizar(id, marca);
        return actualizado != null ? ResponseEntity.ok(actualizado) : ResponseEntity.notFound().build();
     }

     @DeleteMapping("/{id}")
     public ResponseEntity<Void> eliminar(@PathVariable Integer id){
        marcaService.eliminar(id);
        return ResponseEntity.noContent().build();
     }

}
