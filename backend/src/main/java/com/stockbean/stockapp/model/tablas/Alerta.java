package com.stockbean.stockapp.model.tablas;

import java.time.LocalDateTime;

import com.stockbean.stockapp.model.catalogos.TipoAlerta;

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
@Data
@Table(name = "tbl_alertas")
@NoArgsConstructor
@AllArgsConstructor
public class Alerta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_alerta")
    private Integer idAlerta;

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @ManyToOne
    @JoinColumn(name = "id_sucursal", nullable = false)
    private Sucursal sucursal;

    @ManyToOne
    @JoinColumn(name = "id_tipo_alerta", nullable = false)
    private TipoAlerta tipoAlerta;

    private LocalDateTime fecha;
    private String mensaje;
    private Boolean status;

    @Column(name = "fecha_alta")
    private LocalDateTime fechaAlta;

    @Column(name = "fecha_ultima_modificacion")
    private LocalDateTime fechaUltimaModificacion;
}
