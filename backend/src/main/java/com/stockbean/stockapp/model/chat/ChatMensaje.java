package com.stockbean.stockapp.model.chat;

import java.time.LocalDateTime;

import com.stockbean.stockapp.model.tablas.Usuario;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "chat_mensajes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMensaje {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mensaje_chat")
    private Integer idMensajeChat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_chat", nullable = false)
    private ChatHilo chatHilo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "contenido_chat", nullable = false)
    private String contenidoChat;

    @Column(name = "fecha_alta_chat", insertable = false, updatable = false)
    private LocalDateTime fechaAltaChat;
}
