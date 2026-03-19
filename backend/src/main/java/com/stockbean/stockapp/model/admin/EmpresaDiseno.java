package com.stockbean.stockapp.model.admin;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "admin_empresa_diseno")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmpresaDiseno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_diseno")
    private Integer idDiseno;

    @OneToOne
    @JoinColumn(name = "id_empresa", referencedColumnName = "id_empresa", unique = true)
    private Empresa empresa;

    @Column(name = "color_primario")
    private String colorPrimario;

    @Column(name = "color_secundario")
    private String colorSecundario;

    @Column(name = "color_acento")
    private String colorAcento;

    @Column(name = "color_fondo")
    private String colorFondo;

    @Column(name = "url_logo", columnDefinition = "TEXT")
    private String urlLogo;

    @Column(name = "url_favicon", columnDefinition = "TEXT")
    private String urlFavicon;

    @Column(name = "fuente_familia")
    private String fuenteFamilia;

    @Column(name = "estilo_boton")
    private String estiloBoton;

    @Column(name = "redondeo_componentes")
    private String redondeoComponentes;

    @Column(name = "tema_oscuro_habilitado")
    private Boolean temaOscuroHabilitado;

    @Column(name = "fecha_alta", updatable = false)
    private LocalDateTime fechaAlta;

    @Column(name = "fecha_ultima_modificacion")
    private LocalDateTime fechaUltimaModificacion;

    @Column(name = "usuario_modifico")
    private Integer usuarioModifico;
}
