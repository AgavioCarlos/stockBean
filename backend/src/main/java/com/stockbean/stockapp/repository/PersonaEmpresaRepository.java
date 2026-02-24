package com.stockbean.stockapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.stockbean.stockapp.model.admin.PersonaEmpresa;

@Repository
public interface PersonaEmpresaRepository extends JpaRepository<PersonaEmpresa, Integer> {

    List<PersonaEmpresa> findByEmpresa_IdEmpresaIn(List<Integer> idsEmpresa);

}
