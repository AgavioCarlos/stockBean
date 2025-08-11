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
@Table(name = "cat_planes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Plan {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_plan")
    private Integer id_plan;
    private String nombre;
    private String descripcion;
    @Column(name = "precio_mensual")
    private Integer precioMensual;
    @Column(name = "precio_anual")
    private Integer precioAnual;
    private String caracteristicas;
    private Boolean status;
    @Column(name ="fecha_alta")
    private LocalDateTime fechaAlta;
    @Column(name = "fecha_baja")
    private LocalDateTime fechaBaja;
    @Column(name = "fecha_ultima_modificacion")
    private LocalDateTime fechaUltimaActualizacion;
}
