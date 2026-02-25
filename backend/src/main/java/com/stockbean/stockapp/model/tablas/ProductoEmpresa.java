package com.stockbean.stockapp.model.tablas;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.stockbean.stockapp.model.admin.Empresa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "inv_producto_empresa")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoEmpresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto_empresa")
    private Integer idProductoEmpresa;

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @ManyToOne
    @JoinColumn(name = "id_empresa", nullable = false)
    private Empresa empresa;

    @Column(name = "precio_compra")
    private BigDecimal precioCompra;

    @Column(name = "precio_venta")
    private BigDecimal precioVenta;

    @Column(name = "costo_promedio")
    private BigDecimal costoPromedio;

    @Column(name = "maneja_inventario")
    private Boolean manejaInventario = true;

    @Column(name = "permite_venta")
    private Boolean permiteVenta = true;

    @Column(name = "permite_compra")
    private Boolean permiteCompra = true;

    private Boolean activo = true;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
}
