package com.stockbean.stockapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.stockbean.stockapp.model.tablas.ProductoProveedor;

public interface ProductoProveedorRepository extends JpaRepository<ProductoProveedor, Integer> {

    /** Obtiene todas las relaciones activas de un proveedor */
    List<ProductoProveedor> findByIdProveedorAndStatus(Integer idProveedor, Boolean status);

    /** Obtiene todas las relaciones (activas e inactivas) de un proveedor */
    List<ProductoProveedor> findByIdProveedor(Integer idProveedor);

    /** Verifica si ya existe la relación producto-proveedor */
    boolean existsByIdProductoAndIdProveedorAndStatus(Integer idProducto, Integer idProveedor, Boolean status);
}
