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
@Table(name = "tbl_movimientos_caja")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovimientoCaja {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_movimiento")
    private Integer idMovimiento;

    @ManyToOne
    @JoinColumn(name = "id_turno")
    private TurnoCaja turno;

    @Column(name = "tipo_movimiento")
    private String tipoMovimiento;

    @Column(name = "concepto")
    private String concepto;

    @Column(name = "monto")
    private Double monto;

    @Column(name = "fecha")
    private LocalDateTime fecha;

    @Column(name = "id_autorizador")
    private Integer idAutorizador;
}
