package com.stockbean.stockapp.model.tablas;

import java.time.LocalDateTime;

import com.stockbean.stockapp.model.catalogos.MetodoPago;

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
@Table(name = "tbl_ventas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Venta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_venta")
    private Integer idVenta;

    @Column(name = "id_sucursal")
    private Integer idSucursal;

    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Column(name = "fecha_venta")
    private LocalDateTime fechaVenta;

    private Integer total;

    @ManyToOne()
    @JoinColumn(name = "id_metodo_pago")
    private MetodoPago metodoPago;

    @Column(name = "ticket_url")
    private String ticketUrl;

    @Column(name = "fecha_alta")
    private LocalDateTime fechaAlta;

    @Column(name = "fecha_baja")
    private LocalDateTime fechaBaja;

    @Column(name = "fecha_ultima_modificacion")
    private LocalDateTime fechaUltimaModificacion;
}
