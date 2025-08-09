package com.stockbean.stockapp.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.stockbean.stockapp.model.tablas.Producto;


public  interface ProductoRepository extends JpaRepository<Producto, Integer>{
    List<Producto> findByStatus(Boolean status);

}