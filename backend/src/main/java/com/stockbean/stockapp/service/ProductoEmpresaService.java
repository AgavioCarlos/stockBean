package com.stockbean.stockapp.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stockbean.stockapp.model.tablas.ProductoEmpresa;
import com.stockbean.stockapp.model.tablas.Producto;
import com.stockbean.stockapp.model.admin.Empresa;
import com.stockbean.stockapp.repository.ProductoEmpresaRepository;
import com.stockbean.stockapp.repository.EmpresaUsuarioRepository;

@Service
public class ProductoEmpresaService {

    @Autowired
    private ProductoEmpresaRepository productoEmpresaRepository;

    @Autowired
    private EmpresaUsuarioRepository empresaUsuarioRepository;

    public List<ProductoEmpresa> listarPorSolicitante(@NonNull Integer idUsuario) {
        List<Integer> idsEmpresa = empresaUsuarioRepository.findIdEmpresaByUsuarioId(idUsuario);
        if (idsEmpresa.isEmpty())
            return List.of();
        return productoEmpresaRepository.findByEmpresaIdEmpresa(idsEmpresa.get(0));
    }

    public ProductoEmpresa obtenerPorId(Integer id) {
        return productoEmpresaRepository.findById(id).orElse(null);
    }

    @Transactional
    public ProductoEmpresa guardar(ProductoEmpresa pe, @NonNull Integer idUsuario) {
        List<Integer> idsEmpresa = empresaUsuarioRepository.findIdEmpresaByUsuarioId(idUsuario);
        if (idsEmpresa.isEmpty())
            throw new RuntimeException("Usuario no tiene empresa");

        Empresa emp = new Empresa();
        emp.setIdEmpresa(idsEmpresa.get(0));
        pe.setEmpresa(emp);

        pe.setFechaCreacion(LocalDateTime.now());
        pe.setFechaActualizacion(LocalDateTime.now());
        if (pe.getActivo() == null)
            pe.setActivo(true);
        if (pe.getManejaInventario() == null)
            pe.setManejaInventario(true);
        if (pe.getPermiteCompra() == null)
            pe.setPermiteCompra(true);
        if (pe.getPermiteVenta() == null)
            pe.setPermiteVenta(true);
        if (pe.getPrecioCompra() == null)
            pe.setPrecioCompra(java.math.BigDecimal.ZERO);
        if (pe.getPrecioVenta() == null)
            pe.setPrecioVenta(java.math.BigDecimal.ZERO);
        if (pe.getCostoPromedio() == null)
            pe.setCostoPromedio(java.math.BigDecimal.ZERO);

        return productoEmpresaRepository.save(pe);
    }

    @Transactional
    public ProductoEmpresa actualizar(Integer id, ProductoEmpresa actualizado, @NonNull Integer idUsuario) {
        ProductoEmpresa existente = obtenerPorId(id);
        if (existente == null)
            return null;

        List<Integer> idsEmpresa = empresaUsuarioRepository.findIdEmpresaByUsuarioId(idUsuario);
        if (idsEmpresa.isEmpty() || !existente.getEmpresa().getIdEmpresa().equals(idsEmpresa.get(0))) {
            throw new RuntimeException("Acceso denegado a esta empresa");
        }

        existente.setPrecioCompra(actualizado.getPrecioCompra());
        existente.setPrecioVenta(actualizado.getPrecioVenta());
        existente.setCostoPromedio(actualizado.getCostoPromedio());
        existente.setManejaInventario(actualizado.getManejaInventario());
        existente.setPermiteCompra(actualizado.getPermiteCompra());
        existente.setPermiteVenta(actualizado.getPermiteVenta());
        existente.setActivo(actualizado.getActivo());

        if (actualizado.getProducto() != null && actualizado.getProducto().getId_producto() != null) {
            Producto prod = new Producto();
            prod.setId_producto(actualizado.getProducto().getId_producto());
            existente.setProducto(prod);
        }

        existente.setFechaActualizacion(LocalDateTime.now());
        return productoEmpresaRepository.save(existente);
    }

    @Transactional
    public void eliminar(Integer id, @NonNull Integer idUsuario) {
        ProductoEmpresa existente = obtenerPorId(id);
        if (existente != null) {
            List<Integer> idsEmpresa = empresaUsuarioRepository.findIdEmpresaByUsuarioId(idUsuario);
            if (!idsEmpresa.isEmpty() && existente.getEmpresa().getIdEmpresa().equals(idsEmpresa.get(0))) {
                existente.setActivo(false);
                existente.setFechaActualizacion(LocalDateTime.now());
                productoEmpresaRepository.save(existente);
            }
        }
    }
}
