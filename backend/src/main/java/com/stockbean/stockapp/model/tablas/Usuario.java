package com.stockbean.stockapp.model.tablas;

import java.time.LocalDateTime;

import com.stockbean.stockapp.model.catalogos.Rol;

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
@Table(name = "tbl_usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_usuario;

    @ManyToOne
    @JoinColumn(name = "id_persona", nullable = false)

    private Persona persona;

    private String cuenta;
    private String password;

    @ManyToOne
    @JoinColumn(name = "id_rol")
    private Rol rol;

    private Boolean status;

    private LocalDateTime fecha_alta;
    private LocalDateTime fecha_baja;
    private LocalDateTime fecha_ultima_modificacion;

    // Métodos de conveniencia para compatibilidad y acceso fácil al rol
    public Integer getId_rol() {
        return (rol != null) ? rol.getId_rol() : null;
    }

    public String getNombre_rol() {
        return (rol != null) ? rol.getNombre() : null;
    }
}