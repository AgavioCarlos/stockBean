package com.stockbean.stockapp.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stockbean.stockapp.model.tablas.Producto;
import com.stockbean.stockapp.repository.ProductoRepository;

@Service
public class ProductoService {
    @Autowired
    private ProductoRepository productoRepository; 

    public List<Producto> listarTodos(){
        return productoRepository.findAll();
    }

    public Producto obtenerPorId(Integer id){
        return productoRepository.findById(id).orElse(null);
    }

    public Producto guardar(Producto producto){
        producto.setFecha_alta(LocalDateTime.now());
        producto.setFecha_ultima_modificacion(LocalDateTime.now());
        producto.setStatus(true);
        return productoRepository.save(producto);
    }

    public Producto actualizar(Integer id, Producto productoActualizado){
        Producto producto = obtenerPorId(id);
        if(producto == null) return null;

        producto.setNombre(productoActualizado.getNombre());
        producto.setDescripcion(productoActualizado.getDescripcion());
        producto.setId_categoria(productoActualizado.getId_categoria());
        producto.setId_unidad(productoActualizado.getId_unidad());
        producto.setId_marca(productoActualizado.getId_marca());
        producto.setCodigo_barras(productoActualizado.getCodigo_barras());
        producto.setImagen_url(productoActualizado.getImagen_url());
        producto.setStatus(productoActualizado.getStatus());
        producto.setFecha_ultima_modificacion(LocalDateTime.now());

        return productoRepository.save(producto);
    }

    public void eliminar(Integer id){
        Producto producto = obtenerPorId(id);
        if(producto != null){
            producto.setStatus(false);
            producto.setFecha_baja(LocalDateTime.now());
            producto.setFecha_ultima_modificacion(LocalDateTime.now());
            productoRepository.save(producto);

        }
    }
}
