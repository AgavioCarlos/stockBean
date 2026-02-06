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
@Data
@Table(name = "tbl_bitacora")
@NoArgsConstructor
@AllArgsConstructor
public class Bitacora {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_bitacora;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    private String modulo;
    private String accion;
    private String descripcion;;
    private LocalDateTime fecha;
    private String ip;

    @Column(name = "datos_anteriores")
    private String datosAnteriores;

    @Column(name = "datos_nuevos")
    private String datosNuevos;

    @Column(name = "fecha_alta")
    private LocalDateTime fechaAlta;

    @Column(name = "fecha_baja")
    private LocalDateTime fechaBaja;

    @Column(name = "fecha_ultima_modificacion")
    private LocalDateTime fechaUltimaModificacion;
}
