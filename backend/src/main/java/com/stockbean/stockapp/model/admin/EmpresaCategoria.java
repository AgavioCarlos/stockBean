package com.stockbean.stockapp.model.admin;

import java.time.LocalDateTime;

import com.stockbean.stockapp.model.catalogos.Categoria;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "empres_categorias")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmpresaCategoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_empres_categoria")
    private Integer idEmpresCategoria;

    @ManyToOne
    @JoinColumn(name = "id_empresa", nullable = false)
    private Empresa empresa;

    @ManyToOne
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;

    private Boolean status;

    @Column(name = "fecha_alta", updatable = false)
    private LocalDateTime fechaAlta;

    @Column(name = "fecha_ultima_modificacion")
    private LocalDateTime fechaUltimaModificacion;

    @PrePersist
    public void prePersist() {
        this.fechaAlta = LocalDateTime.now();
        this.fechaUltimaModificacion = LocalDateTime.now();
        if (this.status == null) {
            this.status = true;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.fechaUltimaModificacion = LocalDateTime.now();
    }
}
