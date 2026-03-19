package com.stockbean.stockapp.repository.chat;

import com.stockbean.stockapp.model.chat.ChatHilo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatHiloRepository extends JpaRepository<ChatHilo, Integer> {
    List<ChatHilo> findByEmpresaIdEmpresa(Integer idEmpresa);
}
