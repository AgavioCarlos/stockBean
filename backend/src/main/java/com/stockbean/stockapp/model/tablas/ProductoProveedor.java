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
@Table(name = "tbl_productos_proveedor")
@NoArgsConstructor
@AllArgsConstructor

public class ProductoProveedor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer id_producto_proveedor;
    private Integer id_producto;
    private Integer id_proveedor;
    private Number precio;
    private String codigo_proveedor;
    private Integer tiempo_entrega;
    private Boolean status;

    private LocalDateTime fecha_alta;
    private LocalDateTime fecha_baja;
    private LocalDateTime fecha_ultima_modificacion;

};
