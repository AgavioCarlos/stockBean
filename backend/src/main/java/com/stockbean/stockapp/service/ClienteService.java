package com.stockbean.stockapp.service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.stockbean.stockapp.repository.ClienteRepository;
import com.stockbean.stockapp.repository.PersonaRepository;
import com.stockbean.stockapp.dto.ClienteRequest;
import com.stockbean.stockapp.model.tablas.Cliente;
import com.stockbean.stockapp.model.tablas.Persona;

@Service
public class ClienteService {
    @Autowired 
    private ClienteRepository clienteRepository;

    @Autowired PersonaRepository personaRepository;

    public List<Cliente> listarTodos(){
        return clienteRepository.findAll();
    }

    public Cliente obtenerPorId(Integer id){
        return clienteRepository.findById(id).orElseThrow(() -> new RuntimeException("Cliente no encontrado con id: " + id));
    }

    public Cliente guardar (ClienteRequest dto){
        Cliente cliente = new Cliente();
        Persona persona = personaRepository.findById(dto.getIdPersona())
            .orElseThrow(() -> new RuntimeException("Persona no encontrada"));
        cliente.setPersona(persona);
        cliente.setStatus(true);
        cliente.setFechaAlta(LocalDateTime.now());
        cliente.setFechaUltimaModificacion(LocalDateTime.now());
        cliente.setTipoCliente(dto.getTipoCliente());
        return clienteRepository.save(cliente);
    }

    public Cliente actualizar (Integer id, ClienteRequest dtoActualizado){
        Cliente cliente = obtenerPorId(id); // Esto ya lanza una excepción si no lo encuentra.

        Persona persona = personaRepository.findById(dtoActualizado.getIdPersona())
            .orElseThrow(() -> new RuntimeException("Persona no encontrada"));
        cliente.setPersona(persona);
        cliente.setTipoCliente(dtoActualizado.getTipoCliente());
        cliente.setFechaUltimaModificacion(LocalDateTime.now());
        return clienteRepository.save(cliente);
    }

    public void eliminar(Integer id){
        Cliente cliente = obtenerPorId(id);
        if(cliente != null){
            cliente.setStatus(false);
            cliente.setFechaBaja(LocalDateTime.now());
            cliente.setFechaUltimaModificacion(LocalDateTime.now());
            clienteRepository.save(cliente);
        } 
    }
}
