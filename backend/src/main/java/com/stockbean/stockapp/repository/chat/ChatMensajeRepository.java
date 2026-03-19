package com.stockbean.stockapp.repository.chat;

import com.stockbean.stockapp.model.chat.ChatMensaje;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatMensajeRepository extends JpaRepository<ChatMensaje, Integer> {
    
    @Query("SELECT m FROM ChatMensaje m WHERE m.chatHilo.idChat = :idChat ORDER BY m.fechaAltaChat DESC")
    Page<ChatMensaje> buscarMensajesPorHilo(
            @Param("idChat") Integer idChat, 
            Pageable pageable
    );
}
