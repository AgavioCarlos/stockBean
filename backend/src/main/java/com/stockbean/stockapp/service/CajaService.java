package com.stockbean.stockapp.service;

import java.time.LocalDateTime;
import java.util.List;
import java.math.BigDecimal;

import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stockbean.stockapp.dto.AperturaCajaRequest;
import com.stockbean.stockapp.dto.CierreCajaRequest;
import com.stockbean.stockapp.dto.MovimientoCajaRequest;
import com.stockbean.stockapp.model.tablas.Caja;
import com.stockbean.stockapp.model.tablas.MovimientoCaja;
import com.stockbean.stockapp.model.tablas.TurnoCaja;
import com.stockbean.stockapp.repository.CajaRepository;
import com.stockbean.stockapp.repository.MovimientoCajaRepository;
import com.stockbean.stockapp.repository.TurnoCajaRepository;

@Service
public class CajaService {

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private CajaRepository cajaRepository;

    @Autowired
    private TurnoCajaRepository turnoCajaRepository;

    @Autowired
    private MovimientoCajaRepository movimientoCajaRepository;

    public List<Caja> obtenerCajasPorSucursal(Integer idSucursal) {
        // Asumiendo que quisieramos filtrar (por ahora findAll que se podria filtrar)
        // para un caso simple retorna todas, habria que agregar findByIdSucursal
        return cajaRepository.findAll().stream()
                .filter(c -> c.getIdSucursal().equals(idSucursal))
                .toList();
    }

    public TurnoCaja obtenerTurnoActivo(Integer idUsuario) {
        return turnoCajaRepository.findByIdUsuarioAndEstado(idUsuario, "ABIERTO");
    }

    @Transactional
    public TurnoCaja abrirCaja(AperturaCajaRequest request, Integer idUsuario) {
        TurnoCaja turnoExistente = turnoCajaRepository.findByIdUsuarioAndEstado(idUsuario, "ABIERTO");
        if (turnoExistente != null) {
            throw new RuntimeException("El usuario ya tiene un turno de caja abierto.");
        }

        Caja caja = cajaRepository.findById(request.getIdCaja())
                .orElseThrow(() -> new RuntimeException("Caja no encontrada"));

        TurnoCaja turno = new TurnoCaja();
        turno.setIdUsuario(idUsuario);
        turno.setCaja(caja);
        turno.setFechaApertura(LocalDateTime.now());
        turno.setMontoInicial(request.getMontoInicial());
        turno.setEstado("ABIERTO");

        return turnoCajaRepository.save(turno);
    }

    @Transactional
    public TurnoCaja cerrarCaja(CierreCajaRequest request, Integer idUsuario) {
        TurnoCaja turno = turnoCajaRepository.findById(request.getIdTurno())
                .orElseThrow(() -> new RuntimeException("Turno no encontrado"));

        if (!turno.getIdUsuario().equals(idUsuario)) {
            throw new RuntimeException("No tienes permisos para cerrar este turno.");
        }

        if ("CERRADO".equals(turno.getEstado())) {
            throw new RuntimeException("El turno ya está cerrado.");
        }

        turnoCajaRepository.cerrarTurno(request.getIdTurno(), BigDecimal.valueOf(request.getMontoReal()));

        // Limpiar el caché de sesión actual para forzar la recarga de la BD
        entityManager.clear();

        // Retornar el turno actualizado directo desde la BD
        return turnoCajaRepository.findById(request.getIdTurno()).orElse(null);
    }

    @Transactional
    public MovimientoCaja registrarMovimiento(MovimientoCajaRequest request, Integer idUsuario) {
        TurnoCaja turno = turnoCajaRepository.findById(request.getIdTurno())
                .orElseThrow(() -> new RuntimeException("Turno no encontrado"));

        if (!turno.getIdUsuario().equals(idUsuario)) {
            throw new RuntimeException("No tienes permisos sobre este turno.");
        }

        if ("CERRADO".equals(turno.getEstado())) {
            throw new RuntimeException("No se pueden registrar movimientos en un turno cerrado.");
        }

        MovimientoCaja mov = new MovimientoCaja();
        mov.setTurno(turno);
        mov.setTipoMovimiento(request.getTipoMovimiento());
        mov.setConcepto(request.getConcepto());
        mov.setMonto(request.getMonto());
        mov.setFecha(LocalDateTime.now());
        mov.setIdAutorizador(idUsuario);

        return movimientoCajaRepository.save(mov);
    }
}
