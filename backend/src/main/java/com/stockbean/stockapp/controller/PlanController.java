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
import com.stockbean.stockapp.model.catalogos.Plan;
import com.stockbean.stockapp.service.PlanService;


@RestController
@RequestMapping("/planes")
public class PlanController {

    @Autowired
    private PlanService planService;

    @GetMapping
    public List<Plan> listar(){
        return planService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Plan> obtener(@PathVariable Integer id) {
        Plan plan = planService.obtenerPorId(id);
        return plan != null ? ResponseEntity.ok(plan) : ResponseEntity.notFound().build();
    }

    @PostMapping()
    public Plan crear(@RequestBody Plan plan){
        System.out.println("Plan recibido en controlador: " + plan);
        return planService.guardar(plan);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Plan> actualizar(@PathVariable Integer id, @RequestBody Plan plan){
        Plan actualizado = planService.actualizar(id, plan);
        return actualizado != null ? ResponseEntity.ok(actualizado) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id){
        planService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
