package com.stockbean.stockapp.dto.chat;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ChatMensajeDTO {
    private Integer idMensajeChat;
    private Integer idChat;
    private Integer idUsuario;
    private String nombreUsuario;
    private String contenidoChat;
    private LocalDateTime fechaAltaChat;
}
