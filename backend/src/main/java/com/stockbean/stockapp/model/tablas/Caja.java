package com.stockbean.stockapp.model.tablas;

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
@Table(name = "tbl_cajas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Caja {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_caja")
    private Integer idCaja;

    @Column(name = "id_sucursal")
    private Integer idSucursal;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "activa")
    private Boolean activa;
}
