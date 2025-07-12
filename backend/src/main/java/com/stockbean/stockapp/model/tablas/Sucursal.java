package com.stockbean.stockapp.model.tablas;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table (name = "tbl_sucursales")
@NoArgsConstructor
@AllArgsConstructor

public class Sucursal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_sucursal;
    private String nombre;
    private String direccion;
    private String telefono;
    private String email;
    private Boolean status;
    
    private LocalDateTime fecha_alta;
    private LocalDateTime fecha_baja;
    private LocalDateTime fecha_ultima_modificacion;    
}
