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
@Table(name = "tbl_turnos_caja")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TurnoCaja {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_turno")
    private Integer idTurno;

    @ManyToOne()
    @JoinColumn(name = "id_caja")
    private Caja caja;

    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Column(name = "fecha_apertura")
    private LocalDateTime fechaApertura;

    @Column(name = "monto_inicial")
    private Double montoInicial;

    @Column(name = "fecha_cierre")
    private LocalDateTime fechaCierre;

    @Column(name = "monto_esperado")
    private Double montoEsperado;

    @Column(name = "monto_real")
    private Double montoReal;

    @Column(name = "diferencia")
    private Double diferencia;

    @Column(name = "estado")
    private String estado;
}
