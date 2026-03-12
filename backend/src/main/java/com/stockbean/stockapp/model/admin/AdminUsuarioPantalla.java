package com.stockbean.stockapp.model.admin;

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
@Table(name = "admin_usuario_pantalla")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUsuarioPantalla {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario_pantalla")
    private Integer idUsuarioPantalla;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_empresa")
    private Empresa empresa;

    @ManyToOne
    @JoinColumn(name = "id_pantalla")
    private Pantallas pantalla;

    @Column(name = "ver")
    private Boolean ver;

    @Column(name = "guardar")
    private Boolean guardar;

    @Column(name = "actualizar")
    private Boolean actualizar;

    @Column(name = "eliminar")
    private Boolean eliminar;
}
