package com.stockbean.stockapp.model.tablas;

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
@Table(name="tbl_compras")
@NoArgsConstructor
@AllArgsConstructor
public class Compras{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    
    @Column(name = "id_compra")
    private Integer idCompra;

    @Column(name = "id_sucursal")
    private Integer idSucursal;

    @Column(name = "id_proveedor")
    private Integer idProveedor;

    @Column(name = "fecha_compra")
    private LocalDateTime fechaCompra;

    private Integer total;

    private String observaciones;

    @Column(name = "fecha_alta")
    private LocalDateTime fechaAlta;

    @Column(name = "fecha_baja")
    private LocalDateTime fechaBaja;

    @Column(name = "fecha_ultima_modificacion")
    private LocalDateTime fechaUltimaModificacion;
}

