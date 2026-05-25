package com.stockbean.stockapp.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.stockbean.stockapp.model.tablas.DetalleCompra;
import com.stockbean.stockapp.model.tablas.Compra;

@Repository
public interface DetalleCompraRepository extends JpaRepository<DetalleCompra, Integer> {
    List<DetalleCompra> findByCompra(Compra compra);
    void deleteByCompra(Compra compra);
}
