package com.stockbean.stockapp.service;

import java.time.LocalDateTime;
import java.util.List;
import com.stockbean.stockapp.repository.UnidadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.stockbean.stockapp.dto.ProductoRequest;
import com.stockbean.stockapp.model.tablas.Producto;
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

    public List<Producto> listarTodos(){
        return productoRepository.findAll();
    }

    public Producto obtenerPorId(Integer id){
        return productoRepository.findById(id).orElse(null);
    }

    public Producto guardar(ProductoRequest dto){

        Producto producto = new Producto();
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setCategoria(categoriaRepository.findById(dto.getIdCategoria())
            .orElseThrow(() -> new RuntimeException("Categoría no encontrada")));
        
        producto.setUnidad(unidadRepository.findById(dto.getIdUnidad())
            .orElseThrow(() -> new RuntimeException("Unidad no encontrada")));
        
        producto.setMarca(marcaRepository.findById(dto.getIdMarca())
            .orElse(null));

        producto.setCodigoBarras(dto.getCodigoBarras());
        producto.setImagenUrl(dto.getImagenUrl());
        producto.setStatus(dto.getStatus());
        producto.setFechaAlta(LocalDateTime.now());
        producto.setFechaUltimaModificacion(LocalDateTime.now());
        return productoRepository.save(producto);
    }

    public Producto actualizar(Integer id, Producto productoActualizado){
        Producto producto = obtenerPorId(id);
        if(producto == null) return null;

        producto.setNombre(productoActualizado.getNombre());
        producto.setDescripcion(productoActualizado.getDescripcion());
        producto.setCategoria(productoActualizado.getCategoria());
        producto.setUnidad(productoActualizado.getUnidad());
        producto.setMarca(productoActualizado.getMarca());
        producto.setCodigoBarras(productoActualizado.getCodigoBarras());
        producto.setImagenUrl(productoActualizado.getImagenUrl());
        producto.setStatus(productoActualizado.getStatus());
        producto.setFechaUltimaModificacion(LocalDateTime.now());

        return productoRepository.save(producto);
    }

    public void eliminar(Integer id){
        Producto producto = obtenerPorId(id);
        if(producto != null){
            producto.setStatus(false);
            producto.setFechaBaja(LocalDateTime.now());
            producto.setFechaUltimaModificacion(LocalDateTime.now());
            productoRepository.save(producto);
        }
    }
}
