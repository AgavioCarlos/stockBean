package com.stockbean.stockapp.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.stockbean.stockapp.model.admin.EmpresaDiseno;

@Repository
public interface EmpresaDisenoRepository extends JpaRepository<EmpresaDiseno, Integer> {
    
    Optional<EmpresaDiseno> findByEmpresaIdEmpresa(Integer idEmpresa);
}
