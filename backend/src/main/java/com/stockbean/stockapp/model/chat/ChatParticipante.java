package com.stockbean.stockapp.model.chat;

import java.time.LocalDateTime;

import com.stockbean.stockapp.model.tablas.Usuario;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "chat_participantes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatParticipante {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_participante_chat")
    private Integer idParticipanteChat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_chat", nullable = false)
    private ChatHilo chatHilo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "ultimo_leido_chat")
    private LocalDateTime ultimoLeidoChat;
}
