package com.stockbean.stockapp.service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.stockbean.stockapp.model.tablas.Inventario;
import com.stockbean.stockapp.model.tablas.Sucursal;
import com.stockbean.stockapp.model.tablas.Usuario;
import com.stockbean.stockapp.repository.EmpresaUsuarioRepository;
import com.stockbean.stockapp.repository.InventarioRepository;
import com.stockbean.stockapp.repository.SucursalRepository;
import com.stockbean.stockapp.repository.UsuarioRepository;
import com.stockbean.stockapp.repository.UsuarioSucursalRepository;

import lombok.NonNull;

@Service
public class InventarioService {

    @Autowired
    private InventarioRepository inventarioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private SucursalRepository sucursalRepository;

    @Autowired
    private UsuarioSucursalRepository usuarioSucursalRepository;

    @Autowired
    private EmpresaUsuarioRepository empresaUsuarioRepository;

    public List<Inventario> listarPorUsuarioYSucursal(@NonNull Integer idUsuario, @NonNull Integer idSucursal) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + idUsuario));

        validarAccesoSucursal(usuario, idSucursal);

        return inventarioRepository.findBySucursalIdAndStatusTrue(idSucursal);
    }

    public Inventario guardar(Inventario inventario, @NonNull Integer idUsuario) {
        if (inventario.getSucursal() == null || inventario.getSucursal().getId_sucursal() == null) {
            throw new RuntimeException("Sucursal es requerida para registrar inventario.");
        }

        Integer idSucursal = inventario.getSucursal().getId_sucursal();
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + idUsuario));

        validarAccesoSucursal(usuario, idSucursal);

        if (inventario.getStatus() == null)
            inventario.setStatus(true);
        if (inventario.getFechaAlta() == null)
            inventario.setFechaAlta(LocalDateTime.now());
        inventario.setFechaUltimaModificacion(LocalDateTime.now());

        return inventarioRepository.save(inventario);
    }

    public Inventario actualizar(Integer id, Inventario inventarioDetails, Integer idUsuario) {
        Inventario inventario = inventarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventario no encontrado con ID: " + id));

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + idUsuario));

        // Validate access to the EXISTING inventory item's branch
        validarAccesoSucursal(usuario, inventario.getSucursal().getId_sucursal());

        // Update fields
        if (inventarioDetails.getStock_actual() != null)
            inventario.setStock_actual(inventarioDetails.getStock_actual());
        if (inventarioDetails.getStock_minimo() != null)
            inventario.setStock_minimo(inventarioDetails.getStock_minimo());
        if (inventarioDetails.getFecha_caducidad() != null)
            inventario.setFecha_caducidad(inventarioDetails.getFecha_caducidad());
        if (inventarioDetails.getLoteInventario() != null)
            inventario.setLoteInventario(inventarioDetails.getLoteInventario());

        inventario.setFechaUltimaModificacion(LocalDateTime.now());

        return inventarioRepository.save(inventario);
    }

    public void eliminar(Integer id, Integer idUsuario) {
        Inventario inventario = inventarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventario no encontrado con ID: " + id));

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + idUsuario));

        validarAccesoSucursal(usuario, inventario.getSucursal().getId_sucursal());

        inventario.setStatus(false);
        inventario.setFechaBaja(LocalDateTime.now());
        inventarioRepository.save(inventario);
    }

    public List<Inventario> listarTodos() {
        return inventarioRepository.findAll();
    }

    private void validarAccesoSucursal(Usuario usuario, Integer idSucursal) {
        String rol = usuario.getNombre_rol();

        if (rol == null) {
            throw new RuntimeException("El usuario no tiene un rol asignado.");
        }

        // SISTEM: Acceso total
        if ("SISTEM".equalsIgnoreCase(rol)) {
            return;
        }

        Sucursal sucursalTarget = sucursalRepository.findById(idSucursal)
                .orElseThrow(() -> new RuntimeException("Sucursal no encontrada con ID: " + idSucursal));

        // ADMIN: Acceso total a su Empresa
        if ("ADMIN".equalsIgnoreCase(rol)) {
            List<Integer> companyIds = empresaUsuarioRepository.findIdEmpresaByUsuarioId(usuario.getId_usuario());
            if (companyIds.isEmpty()) {
                throw new RuntimeException("El usuario administrador no tiene empresa asignada.");
            }
            // Check if target sucursal belongs to user's company
            Integer idEmpresa = companyIds.get(0);

            // Check via SucursalRepository query
            List<Sucursal> companySucursales = sucursalRepository.findByEmpresaId(idEmpresa);
            boolean belongs = companySucursales.stream()
                    .anyMatch(s -> s.getId_sucursal().equals(idSucursal));

            if (!belongs) {
                throw new RuntimeException("Acceso denegado: La sucursal no pertenece a su empresa.");
            }
            return;
        }

        // GERENTE: Solo su Sucursal asignada
        // CAJERO: Solo su Sucursal asignada (permisos operativos)
        if ("GERENTE".equalsIgnoreCase(rol) || "CAJERO".equalsIgnoreCase(rol)) {
            // Check if specific user-sucursal link exists
            boolean access = usuarioSucursalRepository.existsByUsuarioAndSucursal(usuario, sucursalTarget);

            if (!access) {
                throw new RuntimeException("Acceso denegado: No tiene permisos sobre esta sucursal.");
            }
            return;
        }

        throw new RuntimeException("Rol de usuario no autorizado (" + rol + ")");
    }
}
