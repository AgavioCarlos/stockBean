package com.stockbean.stockapp.model.tablas;

import java.time.LocalDateTime;

import com.stockbean.stockapp.model.catalogos.Sucursales;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
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

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @ManyToOne
    @JoinColumn(name = "id_sucursal", nullable = false)
    private Sucursales sucursal;

    private Integer stock_actual;
    private Integer stock_minimo;
    private Boolean status;

    @ManyToOne
    @JoinColumn(name = "id_lote_inventario")
    private LoteInventario loteInventario;

    private LocalDateTime fecha_caducidad;

    @Column(name = "fecha_alta", updatable = false)
    private LocalDateTime fechaAlta;

    @Column(name = "fecha_baja")
    private LocalDateTime fechaBaja;

    @Column(name = "fecha_ultima_modificacion")
    private LocalDateTime fechaUltimaModificacion;

    @PrePersist
    protected void onCreate() {
        fechaAlta = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        fechaUltimaModificacion = LocalDateTime.now();
    }
}
