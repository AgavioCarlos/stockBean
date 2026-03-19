package com.stockbean.stockapp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.stockbean.stockapp.model.admin.EmpresaCategoria;
import com.stockbean.stockapp.model.catalogos.Categoria;

@Repository
public interface EmpresaCategoriaRepository extends JpaRepository<EmpresaCategoria, Integer> {
    
    Optional<EmpresaCategoria> findByEmpresa_IdEmpresaAndCategoria_IdCategoria(Integer idEmpresa, Integer idCategoria);
    
    @Query("SELECT c FROM Categoria c JOIN EmpresaCategoria ec ON c.idCategoria = ec.categoria.idCategoria WHERE ec.empresa.idEmpresa = :idEmpresa AND ec.status = true")
    List<Categoria> findCategoriasAsignadas(@Param("idEmpresa") Integer idEmpresa);

    @Query("SELECT c FROM Categoria c WHERE c.status = true AND c.idCategoria NOT IN (SELECT ec.categoria.idCategoria FROM EmpresaCategoria ec WHERE ec.empresa.idEmpresa = :idEmpresa AND ec.status = true)")
    List<Categoria> findCategoriasDisponibles(@Param("idEmpresa") Integer idEmpresa);
}
