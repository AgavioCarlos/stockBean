package com.stockbean.stockapp.model.catalogos;

import java.time.LocalDateTime;
import jakarta.persistence.Table;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

 
@Entity
@Table(name = "cat_roles")
@Data 
@NoArgsConstructor
@AllArgsConstructor
public class Rol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_rol;
    private String nombre;
    private String descripcion; 
    
    private LocalDateTime fecha_alta; 
    private LocalDateTime fecha_baja;
    private LocalDateTime fecha_ultima_modificacion;
}