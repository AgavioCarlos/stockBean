package com.stockbean.stockapp.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stockbean.stockapp.dto.CompraDTO;
import com.stockbean.stockapp.dto.CompraRequest;
import com.stockbean.stockapp.model.tablas.Compra;
import com.stockbean.stockapp.model.tablas.DetalleCompra;
import com.stockbean.stockapp.model.tablas.Sucursal;
import com.stockbean.stockapp.model.tablas.Proveedor;
import com.stockbean.stockapp.repository.CompraRepository;
import com.stockbean.stockapp.repository.DetalleCompraRepository;
import com.stockbean.stockapp.repository.ProductoRepository;
import com.stockbean.stockapp.repository.ProveedorRepository;
import com.stockbean.stockapp.repository.SucursalRepository;

import lombok.NonNull;

@Service
public class CompraService {

    private final CompraRepository compraRepository;
    private final DetalleCompraRepository detalleCompraRepository;
    private final ProductoRepository productoRepository;
    private final ProveedorRepository proveedorRepository;
    private final SucursalRepository sucursalRepository;
    private final EmpresaContextService contextService;

    // S3-B5: Inyección por constructor (Arquitectura actualizada)
    public CompraService(
            CompraRepository compraRepository,
            DetalleCompraRepository detalleCompraRepository,
            ProductoRepository productoRepository,
            ProveedorRepository proveedorRepository,
            SucursalRepository sucursalRepository,
            EmpresaContextService contextService) {
        this.compraRepository = compraRepository;
        this.detalleCompraRepository = detalleCompraRepository;
        this.productoRepository = productoRepository;
        this.proveedorRepository = proveedorRepository;
        this.sucursalRepository = sucursalRepository;
        this.contextService = contextService;
    }

    /**
     * Lista las compras según el contexto de empresa del usuario.
     */
    public List<CompraDTO> listar(@NonNull Integer idUsuario) {
        Integer idEmpresa = contextService.getEmpresaId(idUsuario);

        if (idEmpresa == null) {
            // Caso SISTEM (acceso global o manejo específico)
            return compraRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
        }

        List<Integer> sucursalIds = sucursalRepository.findByEmpresaId(idEmpresa).stream()
                .map(Sucursal::getIdSucursal)
                .collect(Collectors.toList());

        if (sucursalIds.isEmpty())
            return Collections.emptyList();

        return compraRepository.findBySucursalIds(sucursalIds).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene una compra específica por su ID.
     */
    public CompraDTO obtenerPorId(@NonNull Integer id) {
        return compraRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Compra no encontrada con ID: " + id));
    }

    /**
     * Registra una nueva compra y sus detalles.
     */
    @Transactional
    public CompraDTO guardar(CompraRequest request, @NonNull Integer idUsuario) {
        Compra compra = new Compra();
        compra.setIdSucursal(request.getIdSucursal());
        compra.setIdProveedor(request.getIdProveedor());
        compra.setFechaCompra(request.getFechaCompra() != null ? request.getFechaCompra() : LocalDateTime.now());
        compra.setObservaciones(request.getObservaciones());
        compra.setFechaAlta(LocalDateTime.now());
        compra.setFechaUltimaModificacion(LocalDateTime.now());

        // Calculamos el total de la compra sumando subtotales
        BigDecimal totalCalculado = BigDecimal.ZERO;
        List<DetalleCompra> detalles = new ArrayList<>();

        if (request.getDetalles() != null) {
            for (CompraRequest.DetalleRequest detReq : request.getDetalles()) {
                DetalleCompra det = new DetalleCompra();
                det.setProducto(productoRepository.findById(detReq.getIdProducto())
                        .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + detReq.getIdProducto())));
                det.setCantidad(detReq.getCantidad());
                det.setPrecioUnitario(detReq.getPrecioUnitario());

                BigDecimal subtotal = detReq.getPrecioUnitario().multiply(new BigDecimal(detReq.getCantidad()));
                det.setSubtotal(subtotal);
                det.setLote(detReq.getLote());
                if (detReq.getFechaCaducidad() != null && !detReq.getFechaCaducidad().trim().isEmpty()) {
                    det.setFechaCaducidad(LocalDate.parse(detReq.getFechaCaducidad()));
                }
                det.setFechaAlta(LocalDateTime.now());
                det.setFechaUltimaModificacion(LocalDateTime.now());

                totalCalculado = totalCalculado.add(subtotal);
                det.setCompra(compra);
                detalles.add(det);
            }
        }

        compra.setTotal(totalCalculado.intValue());
        Compra savedCompra = compraRepository.save(compra);
        detalleCompraRepository.saveAll(detalles);

        return toDTO(savedCompra);
    }

    /**
     * Actualiza la información de una compra.
     * En este caso, reemplazamos los detalles anteriores por los nuevos para
     * mantener consistencia.
     */
    @Transactional
    public CompraDTO actualizar(Integer id, CompraRequest request) {
        Compra compra = compraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compra no encontrada: " + id));

        compra.setIdSucursal(request.getIdSucursal());
        compra.setIdProveedor(request.getIdProveedor());
        compra.setFechaCompra(request.getFechaCompra());
        compra.setObservaciones(request.getObservaciones());
        compra.setFechaUltimaModificacion(LocalDateTime.now());

        // Limpieza de detalles anteriores e inserción de nuevos
        detalleCompraRepository.deleteByCompra(compra);

        BigDecimal totalCalculado = BigDecimal.ZERO;
        List<DetalleCompra> nuevosDetalles = new ArrayList<>();

        for (CompraRequest.DetalleRequest detReq : request.getDetalles()) {
            DetalleCompra det = new DetalleCompra();
            det.setCompra(compra);
            det.setProducto(productoRepository.findById(detReq.getIdProducto()).orElse(null));
            det.setCantidad(detReq.getCantidad());
            det.setPrecioUnitario(detReq.getPrecioUnitario());

            BigDecimal subtotal = detReq.getPrecioUnitario().multiply(new BigDecimal(detReq.getCantidad()));
            det.setSubtotal(subtotal);
            det.setLote(detReq.getLote());
            if (detReq.getFechaCaducidad() != null && !detReq.getFechaCaducidad().trim().isEmpty()) {
                det.setFechaCaducidad(LocalDate.parse(detReq.getFechaCaducidad()));
            }
            det.setFechaAlta(LocalDateTime.now());
            det.setFechaUltimaModificacion(LocalDateTime.now());

            totalCalculado = totalCalculado.add(subtotal);
            nuevosDetalles.add(det);
        }

        compra.setTotal(totalCalculado.intValue());
        detalleCompraRepository.saveAll(nuevosDetalles);

        return toDTO(compraRepository.save(compra));
    }

    /**
     * Mapea la entidad Compra a un DTO de respuesta, cargando nombres de
     * relaciones.
     */
    private CompraDTO toDTO(Compra c) {
        List<DetalleCompra> detalles = detalleCompraRepository.findByCompra(c);

        String nombreSucursal = sucursalRepository.findById(c.getIdSucursal())
                .map(Sucursal::getNombre).orElse("Desconocida");

        String nombreProveedor = proveedorRepository.findById(c.getIdProveedor())
                .map(Proveedor::getNombre).orElse("Desconocido");

        return CompraDTO.builder()
                .idCompra(c.getIdCompra())
                .idSucursal(c.getIdSucursal())
                .nombreSucursal(nombreSucursal)
                .idProveedor(c.getIdProveedor())
                .nombreProveedor(nombreProveedor)
                .fechaCompra(c.getFechaCompra())
                .total(c.getTotal())
                .observaciones(c.getObservaciones())
                .detalles(detalles.stream().map(d -> new CompraDTO.DetalleDTO(
                        d.getIdDetalleCompra(),
                        d.getProducto().getId_producto(),
                        d.getProducto().getNombre(),
                        d.getCantidad(),
                        d.getPrecioUnitario(),
                        d.getSubtotal(),
                        d.getLote(),
                        d.getFechaCaducidad() != null ? d.getFechaCaducidad().toString() : null))
                        .collect(Collectors.toList()))
                .build();
    }
}
