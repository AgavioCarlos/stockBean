package com.stockbean.stockapp.model.admin;

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
@Table(name = "admin_pantallas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pantallas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pantalla")
    private Integer idPantalla;

    private String clave;

    private String nombre;

    private String ruta;

    private String icono;

    private Integer orden;

    @Column(name = "id_padre")
    private Integer idPadre;

    @Column(name = "es_menu")
    private Boolean esMenu;

    @Column(name = "fecha_alta")
    private LocalDateTime fechaAlta;

    @Column(name = "fecha_baja")
    private LocalDateTime fechaBaja;

    private Boolean status;

}
