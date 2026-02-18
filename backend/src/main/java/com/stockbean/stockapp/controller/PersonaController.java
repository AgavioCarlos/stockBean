package com.stockbean.stockapp.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import com.stockbean.stockapp.service.PersonaService;
import java.util.List;
import com.stockbean.stockapp.model.tablas.Persona;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/personas")
public class PersonaController {

    @Autowired
    private PersonaService personaService;

    @GetMapping("/solicitante/{idUsuarioSolicitante}")
    public ResponseEntity<List<Persona>> listarPersonasPorSolicitante(@PathVariable Integer idUsuarioSolicitante) {
        return ResponseEntity.ok(personaService.listarPersonasPorSolicitante(idUsuarioSolicitante));
    }

    @GetMapping
    public List<Persona> listar() {
        return personaService.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Persona> obtener(@PathVariable Integer id) {
        Persona persona = personaService.obtenerPorId(id);
        return persona != null ? ResponseEntity.ok(persona) : ResponseEntity.notFound().build();
    }

    @PostMapping()
    public Persona crear(@RequestBody Persona persona) {
        return personaService.guardar(persona);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Persona> actualizar(@PathVariable Integer id, @RequestBody Persona persona) {
        Persona actualizada = personaService.actualizar(id, persona);
        return actualizada != null ? ResponseEntity.ok(actualizada) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        personaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
