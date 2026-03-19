package com.stockbean.stockapp.repository.chat;

import com.stockbean.stockapp.model.chat.ChatParticipante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatParticipanteRepository extends JpaRepository<ChatParticipante, Integer> {
    
    @Query("SELECT cp FROM ChatParticipante cp WHERE cp.usuario.id_usuario = :idUsuario")
    List<ChatParticipante> buscarPorUsuario(@Param("idUsuario") Integer idUsuario);

    @Query("SELECT cp FROM ChatParticipante cp WHERE cp.chatHilo.idChat = :idChat")
    List<ChatParticipante> buscarPorHilo(@Param("idChat") Integer idChat);
}
