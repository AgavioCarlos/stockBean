package com.stockbean.stockapp.model.admin;

import java.time.LocalDateTime;

import com.stockbean.stockapp.model.catalogos.Accion;
import com.stockbean.stockapp.model.tablas.Usuario;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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
@Table(name = "admin_usuarios_acciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioAccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario_accion")
    private Integer idUsuarioAccion;

    // Relación con tbl_usuarios
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    // Relación con admin_empresas
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_empresa", nullable = false)
    private Empresa empresa;

    // Relación con admin_pantallas
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_pantalla", nullable = false)
    private Pantallas pantalla;

    // Relación con cat_acciones
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_accion", nullable = false)
    private Accion accion;

    @Column(name = "permitido", nullable = false)
    private Boolean permitido = true;

    @Column(name = "fecha_alta", updatable = false)
    private LocalDateTime fechaAlta;

    @Column(name = "status")
    private Boolean status = true;

}
