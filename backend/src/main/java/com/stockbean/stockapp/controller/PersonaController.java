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
import com.stockbean.stockapp.security.UsuarioPrincipal;
import com.stockbean.stockapp.service.PersonaService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.lang.NonNull;
import java.util.List;
import java.util.Objects;
import com.stockbean.stockapp.model.tablas.Persona;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/personas")
public class PersonaController {

    @Autowired
    private PersonaService personaService;

    @GetMapping("/mis-personas")
    public ResponseEntity<List<Persona>> listarMisPersonas(@AuthenticationPrincipal UsuarioPrincipal principal) {
        return ResponseEntity.ok(personaService.listarPersonasPorSolicitante(Objects.requireNonNull(principal.getId(), "ID del principal es nulo")));
    }

    @GetMapping
    public List<Persona> listar() {
        return personaService.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Persona> obtener(@PathVariable @NonNull Integer id) {
        Persona persona = personaService.obtenerPorId(id);
        return persona != null ? ResponseEntity.ok(persona) : ResponseEntity.notFound().build();
    }

    @PostMapping()
    public Persona crear(@RequestBody Persona persona, @AuthenticationPrincipal UsuarioPrincipal principal) {
        return personaService.guardar(persona, Objects.requireNonNull(principal.getId(), "ID del principal es nulo"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Persona> actualizar(@PathVariable @NonNull Integer id, @RequestBody Persona persona,
            @AuthenticationPrincipal UsuarioPrincipal principal) {
        Persona actualizada = personaService.actualizar(id, persona,
                Objects.requireNonNull(principal.getId(), "ID del principal es nulo"));
        return actualizada != null ? ResponseEntity.ok(actualizada) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable @NonNull Integer id,
            @AuthenticationPrincipal UsuarioPrincipal principal) {
        personaService.eliminar(id, Objects.requireNonNull(principal.getId(), "ID del principal es nulo"));
        return ResponseEntity.noContent().build();
    }
}
