package com.stockbean.stockapp.model.catalogos;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
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
@Table(name = "cat_tipos_alerta")
@NoArgsConstructor
@AllArgsConstructor
public class TipoAlerta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_tipo_alerta;

    private String nombre;
    private String descripcion;
    private Boolean status;

    @Column(name = "fecha_alta")
    private LocalDateTime fecha_alta;

    @Column(name = "fecha_baja")
    private LocalDateTime fecha_baja;
}