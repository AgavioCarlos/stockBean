package com.stockbean.stockapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.stockbean.stockapp.model.catalogos.Marca;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MarcaRepository extends JpaRepository<Marca, Integer> {

    List<Marca> findByStatus(Boolean status);

    List<Marca> findByIdEmpresa(Integer idEmpresa);

    @Query("SELECT m FROM Marca m WHERE m.idEmpresa IS NULL OR m.idEmpresa = :idEmpresa")
    List<Marca> findByIdEmpresaIsNullOrIdEmpresa(@Param("idEmpresa") Integer idEmpresa);
}
