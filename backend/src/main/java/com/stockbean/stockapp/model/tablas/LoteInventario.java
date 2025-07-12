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
@Table(name="tbl_lotes_inventario")
@NoArgsConstructor
@AllArgsConstructor

public class LoteInventario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer id_lote_inventario;
    private Integer id_producto;
    private Integer id_sucursal;
    private Integer cantidad;
    private String lote;
    
    private LocalDateTime fecha_caducidad;
    private LocalDateTime fecha_entrada;
    private LocalDateTime fecha_alta;
    private LocalDateTime fecha_baja;
    private LocalDateTime fecha_ultima_modificacion;
}
