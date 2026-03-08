package com.stockbean.stockapp.service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stockbean.stockapp.model.tablas.Alerta;
import com.stockbean.stockapp.model.tablas.Sucursal;
import com.stockbean.stockapp.model.tablas.Usuario;
import com.stockbean.stockapp.repository.AlertaRepository;
import com.stockbean.stockapp.repository.EmpresaUsuarioRepository;
import com.stockbean.stockapp.repository.SucursalRepository;
import com.stockbean.stockapp.repository.UsuarioRepository;
import com.stockbean.stockapp.repository.UsuarioSucursalRepository;

import lombok.NonNull;

@Service
public class AlertaService {

    @Autowired
    private AlertaRepository alertaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private SucursalRepository sucursalRepository;

    @Autowired
    private EmpresaUsuarioRepository empresaUsuarioRepository;

    @Autowired
    private UsuarioSucursalRepository usuarioSucursalRepository;

    /**
     * Obtiene las alertas activas según el rol del usuario:
     * - SISTEM: Todas las alertas activas
     * - ADMIN: Alertas de las sucursales de su empresa
     * - GERENTE/CAJERO: Alertas de sus sucursales asignadas
     */
    public List<Alerta> obtenerAlertasPorUsuario(@NonNull Integer idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + idUsuario));

        String rol = usuario.getNombre_rol();

        if (rol == null) {
            throw new RuntimeException("El usuario no tiene un rol asignado.");
        }

        // SISTEM: ve todas las alertas
        if ("SISTEM".equalsIgnoreCase(rol)) {
            return alertaRepository.findAllActiveAlertas();
        }

        // ADMIN: ve alertas de las sucursales de su empresa
        if ("ADMIN".equalsIgnoreCase(rol)) {
            List<Integer> companyIds = empresaUsuarioRepository.findIdEmpresaByUsuarioId(idUsuario);
            if (companyIds.isEmpty()) {
                return Collections.emptyList();
            }
            Integer idEmpresa = companyIds.get(0);
            List<Integer> idsSucursales = sucursalRepository.findByEmpresaId(idEmpresa)
                    .stream()
                    .map(Sucursal::getId_sucursal)
                    .collect(Collectors.toList());

            if (idsSucursales.isEmpty()) {
                return Collections.emptyList();
            }
            return alertaRepository.findBySucursalesAndStatusTrue(idsSucursales);
        }

        // GERENTE / CAJERO: ve alertas de sus sucursales asignadas
        if ("GERENTE".equalsIgnoreCase(rol) || "CAJERO".equalsIgnoreCase(rol)) {
            List<Integer> idsSucursales = usuarioSucursalRepository.findByStatusTrue()
                    .stream()
                    .filter(us -> us.getUsuario().getId_usuario().equals(idUsuario))
                    .map(us -> us.getSucursal().getId_sucursal())
                    .collect(Collectors.toList());

            if (idsSucursales.isEmpty()) {
                return Collections.emptyList();
            }
            return alertaRepository.findBySucursalesAndStatusTrue(idsSucursales);
        }

        return Collections.emptyList();
    }

    /**
     * Cuenta las alertas activas para el usuario según su rol.
     */
    public Long contarAlertasPorUsuario(@NonNull Integer idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + idUsuario));

        String rol = usuario.getNombre_rol();

        if ("SISTEM".equalsIgnoreCase(rol)) {
            return alertaRepository.findAllActiveAlertas().stream().count();
        }

        List<Integer> idsSucursales = obtenerSucursalesDelUsuario(idUsuario, rol);
        if (idsSucursales.isEmpty())
            return 0L;

        return alertaRepository.countBySucursalesAndStatusTrue(idsSucursales);
    }

    /**
     * Marca una alerta como leída.
     */
    @Transactional
    public void marcarComoLeida(@NonNull Integer idAlerta) {
        alertaRepository.marcarComoLeida(idAlerta);
    }

    /**
     * Marca todas las alertas del usuario como leídas.
     */
    @Transactional
    public void marcarTodasComoLeidas(@NonNull Integer idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + idUsuario));

        String rol = usuario.getNombre_rol();

        if ("SISTEM".equalsIgnoreCase(rol)) {
            // Para SISTEM, marcar todas
            List<Integer> allSucursalIds = sucursalRepository.findAll()
                    .stream()
                    .map(Sucursal::getId_sucursal)
                    .collect(Collectors.toList());
            if (!allSucursalIds.isEmpty()) {
                alertaRepository.marcarTodasComoLeidas(allSucursalIds);
            }
            return;
        }

        List<Integer> idsSucursales = obtenerSucursalesDelUsuario(idUsuario, rol);
        if (!idsSucursales.isEmpty()) {
            alertaRepository.marcarTodasComoLeidas(idsSucursales);
        }
    }

    // ─── Helper ─────────────────────────────────────────────
    private List<Integer> obtenerSucursalesDelUsuario(Integer idUsuario, String rol) {
        if ("ADMIN".equalsIgnoreCase(rol)) {
            List<Integer> companyIds = empresaUsuarioRepository.findIdEmpresaByUsuarioId(idUsuario);
            if (companyIds.isEmpty())
                return Collections.emptyList();
            return sucursalRepository.findByEmpresaId(companyIds.get(0))
                    .stream()
                    .map(Sucursal::getId_sucursal)
                    .collect(Collectors.toList());
        }

        // GERENTE / CAJERO
        return usuarioSucursalRepository.findByStatusTrue()
                .stream()
                .filter(us -> us.getUsuario().getId_usuario().equals(idUsuario))
                .map(us -> us.getSucursal().getId_sucursal())
                .collect(Collectors.toList());
    }
}
