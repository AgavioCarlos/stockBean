package com.stockbean.stockapp.model.chat;

import java.time.LocalDateTime;

import com.stockbean.stockapp.model.admin.Empresa;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "chat_hilos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatHilo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_chat")
    private Integer idChat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_empresa", nullable = false)
    private Empresa empresa;

    @Column(name = "tipo_chat", nullable = false)
    private String tipoChat;

    @Column(name = "fecha_alta_chat", insertable = false, updatable = false)
    private LocalDateTime fechaAltaChat;
}
