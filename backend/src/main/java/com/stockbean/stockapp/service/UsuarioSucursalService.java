package com.stockbean.stockapp.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import com.stockbean.stockapp.dto.UsuarioSucursalResponse;
import com.stockbean.stockapp.model.tablas.Sucursal;
import com.stockbean.stockapp.model.tablas.UsuarioSucursal;
import com.stockbean.stockapp.repository.SucursalRepository;
import com.stockbean.stockapp.repository.UsuarioSucursalRepository;
import com.stockbean.stockapp.security.AuthHelper;

@Service
public class UsuarioSucursalService {

    @Autowired
    private UsuarioSucursalRepository usuarioSucursalRepository;

    @Autowired
    private SucursalRepository sucursalRepository;

    public List<UsuarioSucursal> listarTodos() {
        return usuarioSucursalRepository.findByStatusTrue();
    }

    public UsuarioSucursal obtenerPorId(@NonNull Integer id) {
        return usuarioSucursalRepository.findById(id).orElse(null);
    }

    public List<UsuarioSucursalResponse> obtenerPorIdUsuario(@NonNull Integer idUsuario) {
        return usuarioSucursalRepository.findByUsuarioIdUsuario(idUsuario);
    }

    public UsuarioSucursal guardar(@NonNull UsuarioSucursal usuarioSucursal) {
        // if (usuarioSucursalRepository.existsByUsuarioAndSucursal(
        // usuarioSucursal.getUsuario(),
        // usuarioSucursal.getSucursal())) {
        // }
        // Agregar idSucursal en el objeto usuarioSucursal antes de guardar
        // Integer idSucursal = AuthHelper.getCurrentSucursalId();
        // // con el idSucursal buscar la sucursal y agregar a setSucursal
        // Sucursal sucursal = sucursalRepository.findById(idSucursal).orElse(null);
        // usuarioSucursal.setSucursal(sucursal);

        return usuarioSucursalRepository.save(usuarioSucursal);
    }

    public UsuarioSucursal actualizar(@NonNull UsuarioSucursal usuarioSucursal) {
        return usuarioSucursalRepository.save(usuarioSucursal);
    }

    public void eliminar(@NonNull Integer id) {
        Optional<UsuarioSucursal> optional = usuarioSucursalRepository.findById(id);
        if (optional.isPresent()) {
            UsuarioSucursal usuarioSucursal = optional.get();
            usuarioSucursal.setStatus(false); // Logical delete
            usuarioSucursal.setFechaBaja(LocalDateTime.now());
            usuarioSucursalRepository.save(usuarioSucursal);
        }
    }
}
