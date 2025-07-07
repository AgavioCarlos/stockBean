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
@Table(name="tbl_productos")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Productos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_producto;
    private String nombre;
    private String descripcion;
    private Integer id_categoria;
    private Integer id_unidad;
    private Integer id_marca;
    private String codigo_barras;
    private String imagen_url;
    private Boolean status;

    private LocalDateTime fecha_alta;
    private LocalDateTime fecha_baja;
    private LocalDateTime fecha_ultima_modificacion;
}
