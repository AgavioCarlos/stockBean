package com.stockbean.stockapp.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.stockbean.stockapp.model.catalogos.Plan;
import com.stockbean.stockapp.repository.PlanRepository;

@Service
public class PlanService {


    @Autowired
    private PlanRepository planRepository;


    public List<Plan> listarTodos(){
        return planRepository.findAll();
    }

    public Plan obtenerPorId(Integer id){
        return planRepository.findById(id).orElse(null);
    }

    public Plan guardar(Plan plan){
        System.out.println("Plan recibido: " + plan);
        plan.setFechaAlta(LocalDateTime.now());
        plan.setFechaUltimaActualizacion(LocalDateTime.now());
        plan.setStatus(true);
        return planRepository.save(plan);
    }

    public Plan actualizar(Integer id, Plan planActualizado){
        Plan plan = obtenerPorId(id);
        if(plan == null) return null;
        plan.setNombre(planActualizado.getNombre());
        plan.setDescripcion(planActualizado.getDescripcion());
        plan.setPrecioMensual(planActualizado.getPrecioMensual());
        plan.setPrecioAnual(planActualizado.getPrecioAnual());
        plan.setCaracteristicas(planActualizado.getCaracteristicas());
        plan.setStatus(planActualizado.getStatus());
        plan.setFechaUltimaActualizacion(LocalDateTime.now());
        return planRepository.save(plan);
    }

    public void eliminar(Integer id){
        Plan plan = obtenerPorId(id);
        if(plan != null){
            plan.setStatus(false);
            plan.setFechaBaja(LocalDateTime.now());
            plan.setFechaUltimaActualizacion(LocalDateTime.now()); 

            planRepository.save(plan);
        }
    }
    
}
