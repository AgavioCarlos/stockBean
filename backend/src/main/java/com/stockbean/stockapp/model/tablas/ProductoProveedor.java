package com.stockbean.stockapp.model.tablas;

import java.math.BigDecimal;
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
@Table(name = "tbl_productos_proveedor")
@NoArgsConstructor
@AllArgsConstructor

public class ProductoProveedor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "id_producto_proveedor")
    private Integer idProductoProveedor;

    @Column(name = "id_producto")
    private Integer idProducto;

    @Column(name = "id_proveedor")
    private Integer idProveedor;

    private BigDecimal precio;

    @Column(name = "codigo_proveedor")
    private String codigoProveedor;

    @Column(name = "tiempo_entrega")
    private Integer tiempoEntrega;

    @Column(name = "status")
    private Boolean status;

    @Column(name = "fecha_alta")
    private LocalDateTime fechaAlta;

    @Column(name = "fecha_baja")
    private LocalDateTime fechaBaja;

    @Column(name = "fecha_ultima_modificacion")
    private LocalDateTime fechaUltimaModificacion;

};
