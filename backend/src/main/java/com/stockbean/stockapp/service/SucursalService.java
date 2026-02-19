package com.stockbean.stockapp.service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.stockbean.stockapp.model.tablas.Sucursal;
import com.stockbean.stockapp.repository.SucursalRepository;

@Service
public class SucursalService {

    @Autowired
    private SucursalRepository sucursalRepository;

    @Autowired
    private com.stockbean.stockapp.repository.UsuarioRepository usuarioRepository;

    @Autowired
    private com.stockbean.stockapp.repository.EmpresaUsuarioRepository empresaUsuarioRepository;

    public List<Sucursal> listarTodos() {
        return sucursalRepository.findAll();
    }

    public List<Sucursal> listarPorEmpresa(Integer idEmpresa) {
        return sucursalRepository.findByEmpresaId(idEmpresa);
    }

    public List<Sucursal> listarSucursalesPorSolicitante(Integer idUsuarioSolicitante) {
        com.stockbean.stockapp.model.tablas.Usuario solicitante = usuarioRepository.findById(idUsuarioSolicitante)
                .orElse(null);

        if (solicitante == null) {
            throw new RuntimeException("Usuario solicitante no encontrado");
        }

        // Si es ROOT / SISTEMAS (id_rol = 1), ve todas las sucursales
        if (Integer.valueOf(1).equals(solicitante.getId_rol())) {
            return sucursalRepository.findAll();
        }

        // Si no es ROOT, obtenemos su empresa y mostramos solo las sucursales de esa
        // empresa
        // (asumiendo que las sucursales están vinculadas a usuarios de esa empresa)
        List<Integer> companyIds = empresaUsuarioRepository.findIdEmpresaByUsuarioId(idUsuarioSolicitante);

        if (companyIds.isEmpty()) {
            return List.of();
        }

        // Tomamos la primera empresa
        Integer idEmpresa = companyIds.get(0);
        return sucursalRepository.findByEmpresaId(idEmpresa);
    }

    @Autowired
    private com.stockbean.stockapp.repository.UsuarioSucursalRepository usuarioSucursalRepository;

    public Sucursal guardar(Sucursal sucursal, Integer idUsuarioCreador) {
        // Asignar valores por defecto al crear
        if (sucursal.getStatus() == null) {
            sucursal.setStatus(true);
        }
        if (sucursal.getFecha_alta() == null) {
            sucursal.setFecha_alta(LocalDateTime.now());
        }
        sucursal.setFecha_ultima_modificacion(LocalDateTime.now());

        Sucursal nuevaSucursal = sucursalRepository.save(sucursal);

        // Crear relación Usuario-Sucursal para el creador
        com.stockbean.stockapp.model.tablas.Usuario creador = usuarioRepository.findById(idUsuarioCreador)
                .orElseThrow(() -> new RuntimeException("Usuario creador no encontrado"));

        com.stockbean.stockapp.model.tablas.UsuarioSucursal relacion = new com.stockbean.stockapp.model.tablas.UsuarioSucursal();
        relacion.setUsuario(creador);
        relacion.setSucursal(nuevaSucursal);
        relacion.setStatus(true);
        // Las fechas se manejan por @PrePersist en UsuarioSucursal, pero podemos
        // asegurarlas

        usuarioSucursalRepository.save(relacion);

        return nuevaSucursal;
    }

    public Sucursal obtenerPorId(Integer id) {
        return sucursalRepository.findById(id).orElse(null);
    }

    public Sucursal actualizar(Integer id, Sucursal sucursalDetails) {
        return sucursalRepository.findById(id).map(sucursal -> {
            sucursal.setNombre(sucursalDetails.getNombre());
            sucursal.setDireccion(sucursalDetails.getDireccion());
            sucursal.setTelefono(sucursalDetails.getTelefono());
            sucursal.setEmail(sucursalDetails.getEmail());
            sucursal.setStatus(sucursalDetails.getStatus());
            return sucursalRepository.save(sucursal);
        }).orElse(null);
    }

    public void eliminar(Integer id) {
        sucursalRepository.findById(id).ifPresent(sucursal -> {
            sucursal.setStatus(false); // Baja lógica
            sucursal.setFecha_baja(LocalDateTime.now());
            sucursalRepository.save(sucursal);
        });
    }
}
