package com.stockbean.stockapp.model.tablas;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

import com.stockbean.stockapp.model.catalogos.MetodoPago;
import com.stockbean.stockapp.model.catalogos.Plan;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Column;

@Entity
@Table(name = "tbl_suscripciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Suscripcion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_suscripcion")
    private Integer idSuscripcion;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_plan")
    private Plan plan;

    @Column(name = "fecha_inicio")
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDateTime fechaFin;

    private Boolean status;

    @ManyToOne
    @JoinColumn(name = "id_metodo_pago")
    private MetodoPago metodoPago;

    @Column(name = "referencia_pago")
    private String referenciaPago;

    @Column(name = "fecha_alta")
    private LocalDateTime fechaAlta;

    @Column(name = "fecha_baja")
    private LocalDateTime fechaBaja;

    @Column(name = "fecha_ultima_modificacion")
    private LocalDateTime fechaUltimaModificacion;

}
