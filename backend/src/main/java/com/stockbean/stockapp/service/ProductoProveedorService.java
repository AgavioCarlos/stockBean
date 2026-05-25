package com.stockbean.stockapp.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stockbean.stockapp.dto.ProductoProveedorDTO;
import com.stockbean.stockapp.model.tablas.Producto;
import com.stockbean.stockapp.model.tablas.ProductoProveedor;
import com.stockbean.stockapp.repository.ProductoProveedorRepository;
import com.stockbean.stockapp.repository.ProductoRepository;

@Service
public class ProductoProveedorService {

    private final ProductoProveedorRepository productoProveedorRepository;
    private final ProductoRepository productoRepository;

    public ProductoProveedorService(
            ProductoProveedorRepository productoProveedorRepository,
            ProductoRepository productoRepository) {
        this.productoProveedorRepository = productoProveedorRepository;
        this.productoRepository = productoRepository;
    }

    /**
     * Lista los productos asignados a un proveedor específico.
     */
    public List<ProductoProveedorDTO> listarPorProveedor(Integer idProveedor) {
        return productoProveedorRepository
                .findByIdProveedor(idProveedor)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Lista solo los productos ACTIVOS asignados a un proveedor.
     */
    public List<ProductoProveedorDTO> listarActivosPorProveedor(Integer idProveedor) {
        return productoProveedorRepository
                .findByIdProveedorAndStatus(idProveedor, true)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Asigna un producto a un proveedor.
     */
    @Transactional
    public ProductoProveedorDTO asignar(Integer idProveedor, ProductoProveedorDTO request) {
        // Evitar duplicados activos
        if (productoProveedorRepository.existsByIdProductoAndIdProveedorAndStatus(
                request.getIdProducto(), idProveedor, true)) {
            throw new RuntimeException("Este producto ya está asignado al proveedor.");
        }

        ProductoProveedor entity = new ProductoProveedor();
        entity.setIdProveedor(idProveedor);
        entity.setIdProducto(request.getIdProducto());
        entity.setPrecio(request.getPrecio());
        entity.setCodigoProveedor(request.getCodigoProveedor());
        entity.setTiempoEntrega(request.getTiempoEntrega());
        entity.setStatus(true);
        entity.setFechaAlta(LocalDateTime.now());
        entity.setFechaUltimaModificacion(LocalDateTime.now());

        return toDTO(productoProveedorRepository.save(entity));
    }

    /**
     * Actualiza los datos de una asignación (precio, código, tiempo de entrega).
     */
    @Transactional
    public ProductoProveedorDTO actualizar(Integer id, ProductoProveedorDTO request) {
        ProductoProveedor entity = productoProveedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asignación no encontrada: " + id));

        entity.setPrecio(request.getPrecio());
        entity.setCodigoProveedor(request.getCodigoProveedor());
        entity.setTiempoEntrega(request.getTiempoEntrega());
        entity.setFechaUltimaModificacion(LocalDateTime.now());

        return toDTO(productoProveedorRepository.save(entity));
    }

    /**
     * Desactiva una asignación producto-proveedor (soft delete).
     */
    @Transactional
    public void desasignar(Integer id) {
        ProductoProveedor entity = productoProveedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asignación no encontrada: " + id));
        entity.setStatus(false);
        entity.setFechaBaja(LocalDateTime.now());
        entity.setFechaUltimaModificacion(LocalDateTime.now());
        productoProveedorRepository.save(entity);
    }

    // ─── Mapper ─────────────────────────────────────────────────────────────────

    private ProductoProveedorDTO toDTO(ProductoProveedor entity) {
        return ProductoProveedorDTO.builder()
                .idProducto(entity.getIdProducto())
                .precio(entity.getPrecio())
                .codigoProveedor(entity.getCodigoProveedor())
                .tiempoEntrega(entity.getTiempoEntrega())
                .build();
    }
}
