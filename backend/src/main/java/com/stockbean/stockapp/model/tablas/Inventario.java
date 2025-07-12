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
@Table(name = "tbl_inventario")
@NoArgsConstructor
@AllArgsConstructor
public class Inventario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer id_inventario;
    private Integer id_productro;
    private Integer id_sucursal;
    private Integer stock_actual;
    private Integer stock_minimo;
    private Boolean status;
    private Integer id_lote_inventario;

    private LocalDateTime fecha_caducidad;
    private LocalDateTime fecha_alta;
    private LocalDateTime fecha_baja;
    private LocalDateTime fecha_ultima_modificacion;
}
