package com.stockbean.stockapp.model.tablas;

import java.sql.Timestamp;

import com.stockbean.stockapp.model.catalogos.Permiso;
import com.stockbean.stockapp.model.catalogos.Rol;

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
@Table(name = "tbl_rol_permiso")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RolPermisos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol_permiso")
    private Integer idRolPermiso;

    @ManyToOne
    @JoinColumn(name = "id_rol")
    private Rol rol;

    @ManyToOne
    @JoinColumn(name = "id_permiso")
    private Permiso permiso;

    @Column(name = "fecha_alta")
    private Timestamp fechaAlta;

    @Column(name = "fecha_baja")
    private Timestamp fechaBaja;

    @Column(name = "fecha_ultima_modificacion")
    private Timestamp fechaUltimaModificacion;

}
