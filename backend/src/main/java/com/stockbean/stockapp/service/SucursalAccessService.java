package com.stockbean.stockapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stockbean.stockapp.model.tablas.Sucursal;
import com.stockbean.stockapp.model.tablas.Usuario;
import com.stockbean.stockapp.model.tablas.UsuarioSucursal;
import com.stockbean.stockapp.repository.EmpresaUsuarioRepository;
import com.stockbean.stockapp.repository.SucursalRepository;
import com.stockbean.stockapp.repository.UsuarioSucursalRepository;

import lombok.NonNull;

/**
 * Servicio centralizado que valida el acceso de un usuario a una sucursal
 * según su rol. Extrae la lógica duplicada de VentaService e InventarioService.
 *
 * Roles soportados:
 *  - SISTEM : acceso total sin restricciones
 *  - ADMIN  : acceso a todas las sucursales de su empresa
 *  - GERENTE: acceso solo a las sucursales asignadas
 *  - CAJERO : acceso solo a las sucursales asignadas
 */
@Service
public class SucursalAccessService {

    @Autowired
    private EmpresaUsuarioRepository empresaUsuarioRepository;

    @Autowired
    private SucursalRepository sucursalRepository;

    @Autowired
    private UsuarioSucursalRepository usuarioSucursalRepository;

    /**
     * Valida que el usuario tenga acceso a la sucursal indicada.
     * Lanza RuntimeException si el acceso es denegado.
     *
     * @param usuario     Usuario autenticado (debe tener nombre_rol cargado)
     * @param idSucursal  ID de la sucursal a validar
     */
    public void validarAcceso(@NonNull Usuario usuario, @NonNull Integer idSucursal) {
        String rol = usuario.getNombre_rol();

        if (rol == null) {
            throw new RuntimeException("El usuario no tiene un rol asignado.");
        }

        // SISTEM: acceso total a cualquier sucursal
        if ("SISTEM".equalsIgnoreCase(rol)) {
            return;
        }

        Sucursal sucursalTarget = sucursalRepository.findById(idSucursal)
                .orElseThrow(() -> new RuntimeException("Sucursal no encontrada con ID: " + idSucursal));

        // ADMIN: acceso total a las sucursales de su empresa
        if ("ADMIN".equalsIgnoreCase(rol)) {
            List<Integer> companyIds = empresaUsuarioRepository.findIdEmpresaByUsuarioId(usuario.getId_usuario());
            if (companyIds.isEmpty()) {
                throw new RuntimeException("El usuario administrador no tiene empresa asignada.");
            }

            Integer idEmpresa = companyIds.get(0);
            List<Sucursal> companySucursales = sucursalRepository.findByEmpresaId(idEmpresa);
            boolean belongs = companySucursales.stream()
                    .anyMatch(s -> s.getId_sucursal().equals(idSucursal));

            if (!belongs) {
                throw new RuntimeException("Acceso denegado: La sucursal no pertenece a su empresa.");
            }
            return;
        }

        // GERENTE / CAJERO: solo sucursales asignadas directamente
        if ("GERENTE".equalsIgnoreCase(rol) || "CAJERO".equalsIgnoreCase(rol)) {
            boolean access = usuarioSucursalRepository.existsByUsuarioAndSucursal(usuario, sucursalTarget);
            if (!access) {
                throw new RuntimeException("Acceso denegado: No tiene permisos sobre esta sucursal.");
            }
            return;
        }

        throw new RuntimeException("Rol de usuario no autorizado (" + rol + ")");
    }
}
