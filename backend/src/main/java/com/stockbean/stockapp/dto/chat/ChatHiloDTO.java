package com.stockbean.stockapp.dto.chat;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ChatHiloDTO {
    private Integer idChat;
    private Integer idEmpresa;
    private String tipoChat;
    private LocalDateTime fechaAltaChat;
}
