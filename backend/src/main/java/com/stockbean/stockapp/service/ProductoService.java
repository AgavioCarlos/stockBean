package com.stockbean.stockapp.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import com.stockbean.stockapp.dto.ProductoDTO;
import com.stockbean.stockapp.repository.*;
import com.stockbean.stockapp.model.admin.Empresa;
import com.stockbean.stockapp.model.tablas.Producto;
import com.stockbean.stockapp.model.tablas.Usuario;
import com.stockbean.stockapp.dto.ProductoRequest;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final UnidadRepository unidadRepository;
    private final MarcaRepository marcaRepository;
    private final EmpresaRepository empresaRepository;
    private final EmpresaContextService contextService;

    // S3-B5: Constructor Injection
    public ProductoService(ProductoRepository productoRepository,
                           CategoriaRepository categoriaRepository,
                           UnidadRepository unidadRepository,
                           MarcaRepository marcaRepository,
                           EmpresaRepository empresaRepository,
                           EmpresaContextService contextService) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
        this.unidadRepository = unidadRepository;
        this.marcaRepository = marcaRepository;
        this.empresaRepository = empresaRepository;
        this.contextService = contextService;
    }

    /**
     * Lista productos filtrados por el contexto del usuario.
     * S3-B3: Retorna DTOs en lugar de entidades.
     */
    public List<ProductoDTO> listar(@NonNull Integer idUsuario) {
        Usuario usuario = contextService.getUsuario(idUsuario);
        List<Producto> productos;

        if (contextService.isSistemas(usuario)) {
            productos = productoRepository.findAll();
        } else {
            productos = productoRepository.findByUsuarioId(idUsuario);
        }

        return productos.stream().map(this::toDTO).collect(Collectors.toList());
    }

    /**
     * Lista productos con paginación server-side.
     * S3-B4: Paginación.
     */
    public Page<ProductoDTO> listarPaginado(@NonNull Integer idUsuario, Pageable pageable) {
        Usuario usuario = contextService.getUsuario(idUsuario);
        Page<Producto> page;

        if (contextService.isSistemas(usuario)) {
            page = productoRepository.findAll(pageable);
        } else {
            page = productoRepository.findByUsuarioId(idUsuario, pageable);
        }

        return page.map(this::toDTO);
    }

    public ProductoDTO obtenerPorId(@NonNull Integer id) {
        return productoRepository.findById(id)
                .map(this::toDTO)
                .orElse(null);
    }

    public ProductoDTO guardar(ProductoRequest dto, @NonNull Integer idUsuario) {
        Producto producto = new Producto();
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        
        // Carga de relaciones
        if (dto.getIdCategoria() != null) {
            producto.setCategoria(categoriaRepository.findById(dto.getIdCategoria())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada")));
        }
        if (dto.getIdUnidad() != null) {
            producto.setUnidad(unidadRepository.findById(dto.getIdUnidad())
                    .orElseThrow(() -> new RuntimeException("Unidad no encontrada")));
        }
        if (dto.getIdMarca() != null) {
            producto.setMarca(marcaRepository.findById(dto.getIdMarca()).orElse(null));
        }

        // S3-B2: Uso de contextService para obtener empresaId
        Integer idEmpresa = dto.getIdEmpresa() != null ? dto.getIdEmpresa() : contextService.getEmpresaId(idUsuario);
        if (idEmpresa != null) {
            Empresa empresa = empresaRepository.findById(idEmpresa)
                    .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));
            producto.setEmpresa(empresa);
        }

        producto.setCodigoBarras(dto.getCodigoBarras());
        producto.setImagenUrl(dto.getImagenUrl());
        producto.setStatus(dto.getStatus() != null ? dto.getStatus() : true);
        producto.setFechaAlta(LocalDateTime.now());
        producto.setFechaUltimaModificacion(LocalDateTime.now());
        
        return toDTO(productoRepository.save(producto));
    }

    public ProductoDTO actualizar(Integer id, ProductoRequest dto) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());

        if (dto.getIdCategoria() != null) {
            producto.setCategoria(categoriaRepository.findById(dto.getIdCategoria())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada")));
        }
        if (dto.getIdUnidad() != null) {
            producto.setUnidad(unidadRepository.findById(dto.getIdUnidad())
                    .orElseThrow(() -> new RuntimeException("Unidad no encontrada")));
        }
        if (dto.getIdMarca() != null) {
            producto.setMarca(marcaRepository.findById(dto.getIdMarca()).orElse(null));
        }

        producto.setCodigoBarras(dto.getCodigoBarras());
        producto.setImagenUrl(dto.getImagenUrl());
        producto.setStatus(dto.getStatus());
        producto.setFechaUltimaModificacion(LocalDateTime.now());

        return toDTO(productoRepository.save(producto));
    }

    public void eliminar(Integer id) {
        productoRepository.findById(id).ifPresent(p -> {
            p.setStatus(false);
            p.setFechaBaja(LocalDateTime.now());
            p.setFechaUltimaModificacion(LocalDateTime.now());
            productoRepository.save(p);
        });
    }

    /**
     * Mapea una entidad Producto a un DTO ligero.
     */
    public ProductoDTO toDTO(Producto p) {
        if (p == null) return null;
        return ProductoDTO.builder()
                .id_producto(p.getId_producto())
                .nombre(p.getNombre())
                .descripcion(p.getDescripcion())
                .codigoBarras(p.getCodigoBarras())
                .imagenUrl(p.getImagenUrl())
                .status(p.getStatus())
                .fechaAlta(p.getFechaAlta())
                .fechaUltimaModificacion(p.getFechaUltimaModificacion())
                .categoria(p.getCategoria() != null ? 
                        new ProductoDTO.CategoriaMiniDTO(p.getCategoria().getIdCategoria(), p.getCategoria().getNombre()) : null)
                .unidad(p.getUnidad() != null ? 
                        new ProductoDTO.UnidadMiniDTO(p.getUnidad().getIdUnidad(), p.getUnidad().getNombre()) : null)
                .marca(p.getMarca() != null ? 
                        new ProductoDTO.MarcaMiniDTO(p.getMarca().getIdMarca(), p.getMarca().getNombre()) : null)
                .idEmpresa(p.getEmpresa() != null ? p.getEmpresa().getIdEmpresa() : null)
                .build();
    }
}
