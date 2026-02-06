package com.stockbean.stockapp.model.tablas;

import java.time.LocalDateTime;

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
@Table(name = "tbl_movimientos_inventario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovimientoInventario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_movimiento_inventario")
    private Integer idMovimientoInventario;

    @ManyToOne
    @JoinColumn(name = "id_producto")
    private Producto producto;

    @ManyToOne
    @JoinColumn(name = "id_sucursal")
    private Sucursal sucursal;

    private String tipo;
    private LocalDateTime fecha;
    private Integer cantidad;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @Column(name = "fecha_alta")
    private LocalDateTime fechaAlta;

    @Column(name = "fecha_baja")
    private LocalDateTime fechaBaja;

    @Column(name = "fecha_ultima_modificacion")
    private LocalDateTime fechaUltimaModificacion;

}