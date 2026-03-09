package com.stockbean.stockapp.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import com.stockbean.stockapp.model.tablas.Proveedor;
import com.stockbean.stockapp.repository.EmpresaUsuarioRepository;
import com.stockbean.stockapp.repository.ProveedorRepository;

@Service
public class ProveedorService {

    @Autowired
    private ProveedorRepository proveedorRepository;

    @Autowired
    private EmpresaUsuarioRepository empresaUsuarioRepository;

    public List<Proveedor> obtenerTodos(Integer idUsuario) {
        List<Integer> companyIds = empresaUsuarioRepository.findIdEmpresaByUsuarioId(idUsuario);
        Integer idEmpresa = companyIds.isEmpty() ? null : companyIds.get(0);
        return proveedorRepository.findByIdEmpresaIsNullOrIdEmpresa(idEmpresa);
    }

    // public List<Proveedor> obtenerTodosActivos() {
    // return proveedorRepository.findByStatus(true);
    // }

    public Optional<Proveedor> obtenerPorId(@NonNull Integer id) {
        return proveedorRepository.findById(id);
    }

    public Proveedor guardar(Proveedor proveedor, Integer idUsuario) {
        if (proveedor.getFechaAlta() == null) {
            proveedor.setFechaAlta(LocalDateTime.now());
        }
        if (proveedor.getStatus() == null) {
            proveedor.setStatus(true);
        }

        List<Integer> companyIds = empresaUsuarioRepository.findIdEmpresaByUsuarioId(idUsuario);
        if (!companyIds.isEmpty() && proveedor.getIdEmpresa() == null) {
            proveedor.setIdEmpresa(companyIds.get(0));
        }

        return proveedorRepository.save(proveedor);
    }

    public Proveedor actualizar(@NonNull Integer id, Proveedor proveedor) {
        return proveedorRepository.findById(id).map(p -> {
            p.setNombre(proveedor.getNombre());
            p.setDireccion(proveedor.getDireccion());
            p.setEmail(proveedor.getEmail());
            // Si el status cambia
            if (proveedor.getStatus() != null) {
                if (!proveedor.getStatus() && p.getStatus()) {
                    p.setFechaBaja(LocalDateTime.now());
                } else if (proveedor.getStatus() && !p.getStatus()) {
                    p.setFechaBaja(null);
                }
                p.setStatus(proveedor.getStatus());
            }
            p.setFechaUltimaModificacion(LocalDateTime.now());
            return proveedorRepository.save(p);
        }).orElseThrow(() -> new RuntimeException("Proveedor no encontrado con id " + id));
    }

    public void eliminar(@NonNull Integer id) {
        proveedorRepository.findById(id).ifPresent(p -> {
            p.setStatus(false);
            p.setFechaBaja(LocalDateTime.now());
            proveedorRepository.save(p);
        });
    }
}
