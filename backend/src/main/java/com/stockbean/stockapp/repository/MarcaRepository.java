package com.stockbean.stockapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.stockbean.stockapp.model.catalogos.Marca;
import java.util.List;


public interface MarcaRepository extends JpaRepository <Marca, Integer> {

    List<Marca> findByStatus(Boolean status);
}
