package com.stockbean.stockapp.model.admin;

import java.time.LocalDateTime;

import com.stockbean.stockapp.model.tablas.Usuario;

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
@Table(name = "admin_empresa_usuario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmpresaUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_empresa_usuario")
    private Integer idEmpresaUsuario;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_empresa", nullable = false)
    private Empresa empresa;

    private Boolean activo;

    @Column(name = "fecha_alta", updatable = false)
    private LocalDateTime fechaAlta;

}
