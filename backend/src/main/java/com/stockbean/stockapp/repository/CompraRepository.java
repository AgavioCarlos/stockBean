package com.stockbean.stockapp.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.stockbean.stockapp.model.tablas.Compra;

@Repository
public interface CompraRepository extends JpaRepository<Compra, Integer> {
    
    @Query("SELECT c FROM Compra c WHERE c.idSucursal IN :idsSucursales ORDER BY c.fechaCompra DESC")
    List<Compra> findBySucursalIds(@Param("idsSucursales") List<Integer> idsSucursales);
}
