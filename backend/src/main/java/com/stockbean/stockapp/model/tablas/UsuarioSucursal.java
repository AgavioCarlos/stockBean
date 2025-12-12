package com.stockbean.stockapp.model.tablas;

import java.time.LocalDateTime;

import com.stockbean.stockapp.model.catalogos.Sucursales;

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
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tbl_usuario_sucursales", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "id_usuario", "id_sucursal" })
})
@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
public class UsuarioSucursal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario_sucursal")
    private Integer idUsuarioSucursal;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    @NonNull
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_sucursal", nullable = false)
    @NonNull
    private Sucursales sucursal;

    @Column(name = "status")
    private Boolean status = true;

    @Column(name = "fecha_alta", updatable = false)
    private LocalDateTime fechaAlta;

    @Column(name = "fecha_baja")
    private LocalDateTime fechaBaja;

    @Column(name = "fecha_ultima_modificacion")
    private LocalDateTime fechaUltimaModificacion;

    @PrePersist
    protected void onCreate() {
        fechaAlta = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        fechaUltimaModificacion = LocalDateTime.now();
    }
}
