package com.stockbean.stockapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.stockbean.stockapp.dto.ClienteRequest;
import com.stockbean.stockapp.model.tablas.Cliente;
import com.stockbean.stockapp.service.ClienteService;

@RestController
@RequestMapping("/clientes")
public class ClienteController {
    @Autowired
    private ClienteService clienteService;

    @GetMapping
    public List<Cliente> listar(){
        return clienteService.listarTodos();
    }

    @GetMapping("{id}")
    public ResponseEntity<Cliente> obtener(@PathVariable Integer id){
        Cliente cliente = clienteService.obtenerPorId(id);
        return cliente != null ? ResponseEntity.ok(cliente) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Cliente> guardar(@RequestBody ClienteRequest dto){
        Cliente resultado = clienteService.guardar(dto);
        return ResponseEntity.ok(resultado);
    }

    @PutMapping("{id}")
    public ResponseEntity<Cliente> actualizar(@PathVariable Integer id, ClienteRequest clienteActualizado){
        Cliente cliente = clienteService.actualizar(id, clienteActualizado);
        return ResponseEntity.ok(cliente);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id){ 
        clienteService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
