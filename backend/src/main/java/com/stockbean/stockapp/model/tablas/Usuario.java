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
@Table(name = "tbl_usuarios")
@Data 
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_usuario;
    private Integer id_persona;
    private String cuenta;
    private String password;
    private Integer id_rol;
    private Boolean status;

    private LocalDateTime fecha_alta; 
    private LocalDateTime fecha_baja;
    private LocalDateTime fecha_ultima_modificacion;
}