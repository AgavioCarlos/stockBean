package com.stockbean.stockapp.service.chat;

import com.stockbean.stockapp.model.chat.ChatHilo;
import com.stockbean.stockapp.model.chat.ChatMensaje;
import com.stockbean.stockapp.repository.chat.ChatHiloRepository;
import com.stockbean.stockapp.repository.chat.ChatMensajeRepository;
import com.stockbean.stockapp.repository.chat.ChatParticipanteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.stockbean.stockapp.model.tablas.Usuario;
import com.stockbean.stockapp.repository.UsuarioRepository;
import com.stockbean.stockapp.dto.chat.ChatMensajeDTO;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatHiloRepository chatHiloRepository;
    private final ChatParticipanteRepository chatParticipanteRepository;
    private final ChatMensajeRepository chatMensajeRepository;
    private final UsuarioRepository usuarioRepository;

    public List<ChatHilo> buscarHilosPorEmpresa(Integer idEmpresa) {
        return chatHiloRepository.findByEmpresaIdEmpresa(idEmpresa);
    }

    public Page<ChatMensajeDTO> buscarMensajesPorHilo(Integer idChat, Pageable pageable) {
        return chatMensajeRepository.buscarMensajesPorHilo(idChat, pageable)
            .map(mensaje -> {
                ChatMensajeDTO dto = new ChatMensajeDTO();
                dto.setIdMensajeChat(mensaje.getIdMensajeChat());
                dto.setIdChat(mensaje.getChatHilo().getIdChat());
                dto.setIdUsuario(mensaje.getUsuario().getId_usuario());
                
                String nombre = mensaje.getUsuario().getPersona() != null ? 
                    mensaje.getUsuario().getPersona().getNombre() : mensaje.getUsuario().getCuenta();
                dto.setNombreUsuario(nombre);
                
                dto.setContenidoChat(mensaje.getContenidoChat());
                dto.setFechaAltaChat(mensaje.getFechaAltaChat());
                return dto;
            });
    }

    public ChatMensajeDTO guardarMensaje(ChatMensajeDTO dto) {
        ChatHilo hilo = chatHiloRepository.findById(dto.getIdChat())
                .orElseThrow(() -> new RuntimeException("Hilo no encontrado"));
        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
                
        ChatMensaje mensaje = new ChatMensaje();
        mensaje.setChatHilo(hilo);
        mensaje.setUsuario(usuario);
        mensaje.setContenidoChat(dto.getContenidoChat());
        // Fecha es asignada por BD pero la seteamos en memoria si es necesario
        
        ChatMensaje guardado = chatMensajeRepository.save(mensaje);
        
        // Retornar el DTO populado para enviarlo al broker
        dto.setIdMensajeChat(guardado.getIdMensajeChat());
        
        String nombre = usuario.getPersona() != null ? usuario.getPersona().getNombre() : usuario.getCuenta();
        dto.setNombreUsuario(nombre);
        
        // Utilizamos la fecha generada o la de la instancia
        if(guardado.getFechaAltaChat() == null) {
            dto.setFechaAltaChat(LocalDateTime.now());
        } else {
            dto.setFechaAltaChat(guardado.getFechaAltaChat());
        }
        
        return dto;
    }
}
