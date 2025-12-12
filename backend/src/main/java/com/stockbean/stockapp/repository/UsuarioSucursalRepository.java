package com.stockbean.stockapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.stockbean.stockapp.model.tablas.UsuarioSucursal;
import com.stockbean.stockapp.model.tablas.Usuario;
import com.stockbean.stockapp.model.catalogos.Sucursales;
import java.util.List;

@Repository
public interface UsuarioSucursalRepository extends JpaRepository<UsuarioSucursal, Integer> {
    List<UsuarioSucursal> findByStatusTrue();

    boolean existsByUsuarioAndSucursal(Usuario usuario, Sucursales sucursal);
}
