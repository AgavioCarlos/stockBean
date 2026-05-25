package com.stockbean.stockapp.service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.stockbean.stockapp.model.tablas.Sucursal;
import com.stockbean.stockapp.model.tablas.Usuario;
import com.stockbean.stockapp.model.tablas.UsuarioSucursal;
import com.stockbean.stockapp.repository.SucursalRepository;
import lombok.NonNull;

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

    public List<Sucursal> listarSucursales() {
        return sucursalRepository.findAll();
    }

    @Autowired
    private com.stockbean.stockapp.repository.UsuarioSucursalRepository usuarioSucursalRepository;

    public Sucursal guardar(Sucursal sucursal, @NonNull Integer idUsuarioCreador) {
        // Asignar valores por defecto al crear
        if (sucursal.getStatus() == null) {
            sucursal.setStatus(true);
        }
        if (sucursal.getFechaAlta() == null) {
            sucursal.setFechaAlta(LocalDateTime.now());
        }
        sucursal.setFechaUltimaModificacion(LocalDateTime.now());

        Sucursal nuevaSucursal = sucursalRepository.save(sucursal);

        // Crear relación Usuario-Sucursal para el creador
        Usuario creador = usuarioRepository.findById(idUsuarioCreador)
                .orElseThrow(() -> new RuntimeException("Usuario creador no encontrado"));

        UsuarioSucursal relacion = new UsuarioSucursal();
        relacion.setUsuario(creador);
        relacion.setSucursal(nuevaSucursal);
        relacion.setStatus(true);
        // Las fechas se manejan por @PrePersist en UsuarioSucursal, pero podemos
        // asegurarlas

        usuarioSucursalRepository.save(relacion);

        return nuevaSucursal;
    }

    public Sucursal obtenerPorId(@NonNull Integer id) {
        return sucursalRepository.findById(id).orElse(null);
    }

    public Sucursal actualizar(@NonNull Integer id, Sucursal sucursalDetails) {
        return sucursalRepository.findById(id).map(sucursal -> {
            sucursal.setNombre(sucursalDetails.getNombre());
            sucursal.setDireccion(sucursalDetails.getDireccion());
            sucursal.setTelefono(sucursalDetails.getTelefono());
            sucursal.setEmail(sucursalDetails.getEmail());
            sucursal.setStatus(sucursalDetails.getStatus());
            return sucursalRepository.save(sucursal);
        }).orElse(null);
    }

    public void eliminar(@NonNull Integer id) {
        sucursalRepository.findById(id).ifPresent(sucursal -> {
            sucursal.setStatus(false); // Baja lógica
            sucursal.setFechaBaja(LocalDateTime.now());
            sucursalRepository.save(sucursal);
        });
    }
}
