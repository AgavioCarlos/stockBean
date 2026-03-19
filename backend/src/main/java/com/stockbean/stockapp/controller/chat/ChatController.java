package com.stockbean.stockapp.controller.chat;

import com.stockbean.stockapp.model.chat.ChatHilo;
import com.stockbean.stockapp.dto.chat.ChatMensajeDTO;
import com.stockbean.stockapp.service.chat.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin("*")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/hilos/empresa/{idEmpresa}")
    public ResponseEntity<List<ChatHilo>> listarHilosEmpresa(@PathVariable Integer idEmpresa) {
        // Retorna todos los hilos correspondientes a una empresa.
        // En una Fase posterior, se filtrará aquí mismo según el token JWT y el id_usuario
        return ResponseEntity.ok(chatService.buscarHilosPorEmpresa(idEmpresa));
    }

    @GetMapping("/hilos/{idChat}/mensajes")
    public ResponseEntity<Page<ChatMensajeDTO>> listarMensajesHilo(
            @PathVariable Integer idChat,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        // Endpoint con paginación usando PageRequest.of(page, size)
        return ResponseEntity.ok(chatService.buscarMensajesPorHilo(idChat, PageRequest.of(page, size)));
    }
}
