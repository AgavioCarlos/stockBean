package com.stockbean.stockapp.model.catalogos;

import java.time.LocalDate;
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
@Table(name = "cat_unidades")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Unidades {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_unidad;
    private String nombre; 
    private String abreviatura;

    private LocalDateTime fecha_alta;
    private LocalDateTime fecha_baja;
    private LocalDate fecha_ultima_modificacion;
}
