package com.stockbean.stockapp.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

import com.stockbean.stockapp.repository.UnidadRepository;
import com.stockbean.stockapp.repository.UsuarioRepository;
import com.stockbean.stockapp.repository.EmpresaUsuarioRepository;
import com.stockbean.stockapp.repository.EmpresaRepository;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.stockbean.stockapp.dto.ProductoRequest;
import com.stockbean.stockapp.model.tablas.Producto;
import com.stockbean.stockapp.model.tablas.Usuario;
import com.stockbean.stockapp.repository.CategoriaRepository;
import com.stockbean.stockapp.repository.MarcaRepository;
import com.stockbean.stockapp.repository.ProductoRepository;


@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private UnidadRepository unidadRepository;

    @Autowired
    private MarcaRepository marcaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private EmpresaUsuarioRepository empresaUsuarioRepository;

    public List<Producto> listar(@NonNull Integer id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuario.getId_rol() == 1) {
            return productoRepository.findAll();
        } else {
            return productoRepository.findByUsuarioId(id);
        }
    }

    public Producto obtenerPorId(@NonNull Integer id) {
        return productoRepository.findById(id).orElse(null);
    }

    public Producto guardar(ProductoRequest dto, @NonNull Integer idUsuario) {

        Producto producto = new Producto();
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        if (dto.getIdCategoria() != null) {
            producto.setCategoria(categoriaRepository.findById(Objects.requireNonNull(dto.getIdCategoria()))
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada")));
        }

        if (dto.getIdUnidad() != null) {
            producto.setUnidad(unidadRepository.findById(Objects.requireNonNull(dto.getIdUnidad()))
                    .orElseThrow(() -> new RuntimeException("Unidad no encontrada")));
        }

        if (dto.getIdMarca() != null) {
            producto.setMarca(marcaRepository.findById(Objects.requireNonNull(dto.getIdMarca())).orElse(null));
        }

        if (dto.getIdEmpresa() != null) {
            producto.setEmpresa(empresaRepository.findById(Objects.requireNonNull(dto.getIdEmpresa()))
                    .orElseThrow(() -> new RuntimeException("Empresa no encontrada")));
        } else if (idUsuario != null) {
            List<Integer> empIds = empresaUsuarioRepository.findIdEmpresaByUsuarioId(idUsuario);
            if (empIds != null && !empIds.isEmpty()) {
                producto.setEmpresa(empresaRepository.findById(Objects.requireNonNull(empIds.get(0))).orElse(null));
            }
        }

        producto.setCodigoBarras(dto.getCodigoBarras());
        producto.setImagenUrl(dto.getImagenUrl());
        producto.setStatus(dto.getStatus() != null ? dto.getStatus() : true);
        producto.setFechaAlta(LocalDateTime.now());
        producto.setFechaUltimaModificacion(LocalDateTime.now());
        return productoRepository.save(producto);
    }

    public Producto actualizar(Integer id, Producto productoActualizado) {
        Producto producto = obtenerPorId(id);
        if (producto == null)
            return null;

        producto.setNombre(productoActualizado.getNombre());
        producto.setDescripcion(productoActualizado.getDescripcion());
        producto.setCategoria(productoActualizado.getCategoria());
        producto.setUnidad(productoActualizado.getUnidad());
        producto.setMarca(productoActualizado.getMarca());
        producto.setCodigoBarras(productoActualizado.getCodigoBarras());
        producto.setImagenUrl(productoActualizado.getImagenUrl());
        producto.setStatus(productoActualizado.getStatus());
        if (productoActualizado.getEmpresa() != null) {
            producto.setEmpresa(productoActualizado.getEmpresa());
        }
        producto.setFechaUltimaModificacion(LocalDateTime.now());

        return productoRepository.save(producto);
    }

    // Nuevo método que acepta ProductoRequest (DTO) para actualizar
    public Producto actualizar(Integer id, ProductoRequest dto) {
        Producto producto = obtenerPorId(id);
        if (producto == null)
            return null;

        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());

        if (dto.getIdCategoria() != null) {
            producto.setCategoria(categoriaRepository.findById(Objects.requireNonNull(dto.getIdCategoria()))
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada")));
        }

        if (dto.getIdUnidad() != null) {
            producto.setUnidad(unidadRepository.findById(Objects.requireNonNull(dto.getIdUnidad()))
                    .orElseThrow(() -> new RuntimeException("Unidad no encontrada")));
        }

        if (dto.getIdMarca() != null) {
            producto.setMarca(marcaRepository.findById(Objects.requireNonNull(dto.getIdMarca())).orElse(null));
        }

        if (dto.getIdEmpresa() != null) {
            producto.setEmpresa(empresaRepository.findById(Objects.requireNonNull(dto.getIdEmpresa()))
                    .orElseThrow(() -> new RuntimeException("Empresa no encontrada")));
        }

        producto.setCodigoBarras(dto.getCodigoBarras());
        producto.setImagenUrl(dto.getImagenUrl());
        producto.setStatus(dto.getStatus());
        producto.setFechaUltimaModificacion(LocalDateTime.now());

        return productoRepository.save(producto);
    }

    public void eliminar(Integer id) {
        Producto producto = obtenerPorId(id);
        if (producto != null) {
            producto.setStatus(false);
            producto.setFechaBaja(LocalDateTime.now());
            producto.setFechaUltimaModificacion(LocalDateTime.now());
            productoRepository.save(producto);
        }
    }
}
