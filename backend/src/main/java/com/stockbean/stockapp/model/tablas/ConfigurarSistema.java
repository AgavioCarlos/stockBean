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
@Table(name = "tbl_configuracion_sistema")
@NoArgsConstructor
@AllArgsConstructor
public class ConfigurarSistema {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_config")
    private Integer idConfig;

    @ManyToOne
    @JoinColumn(name = "id_sucursal", nullable = false)
    private Sucursal sucursal;

    private String parametro;
    private String valor;
    private String descripcion;

    @Column(name = "fecha_alta")
    private LocalDateTime fechaAlta;

    @Column(name = "fecha_baja")
    private LocalDateTime fechaBaja;

    @Column(name = "fecha_ultima_modificacion")
    private LocalDateTime fechaUltimaModificacion;
}
