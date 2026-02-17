package com.stockbean.stockapp.model.tablas;

import java.time.LocalDateTime;

import com.stockbean.stockapp.model.catalogos.Permiso;
import com.stockbean.stockapp.model.catalogos.Plan;

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
@Table(name = "tbl_planes_permisos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlanPermiso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_plan_permiso")
    private Integer idPlanPermiso;

    @ManyToOne
    @JoinColumn(name = "id_plan")
    private Plan plan;

    @ManyToOne
    @JoinColumn(name = "id_permiso")
    private Permiso permiso;

    @Column(name = "fecha_alta")
    private LocalDateTime fechaAlta;

    @Column(name = "fecha_baja")
    private LocalDateTime fechaBaja;

    @Column(name = "fecha_ultima_modificacion")
    private LocalDateTime fechaUltimaModificacion;

}
