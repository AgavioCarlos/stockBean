package com.stockbean.stockapp.model.tablas;

import java.time.LocalDateTime;
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
@Table(name = "tbl_promociones_productos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromocionProducto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_promocion_producto")
    private Integer idPromocionProducto;

    @ManyToOne
    @JoinColumn(name = "id_promocion")
    private Promocion promocion;

    @ManyToOne
    @JoinColumn(name = "id_producto")
    private Producto producto;

    @Column(name = "cantidad_minima")
    private Integer cantidadMinima;

    @Column(name = "cantidad_promo")
    private Integer cantidadPromo;

    private Boolean status;

    @Column(name = "fecha_alta")
    private LocalDateTime fechaAlta;

    @Column(name = "fecha_baja")
    private LocalDateTime fechaBaja;

    @Column(name = "fecha_ultima_modificacion")
    private LocalDateTime fechaUltimaModificacion;

}
