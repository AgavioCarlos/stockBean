package com.stockbean.stockapp.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import com.stockbean.stockapp.dto.SuscripcionAdminDTO;
import com.stockbean.stockapp.model.tablas.Suscripcion;
import com.stockbean.stockapp.repository.SuscripcionRepository;

@Service
public class SuscripcionService {

    @Autowired
    private SuscripcionRepository suscripcionRepository;

    public List<SuscripcionAdminDTO> obtenerSuscripcionesAdmin() {
        return suscripcionRepository.findAllAdminSuscripciones();
    }

    public Suscripcion cambiarStatus(@NonNull Integer idSuscripcion, Boolean newStatus) {
        Optional<Suscripcion> opt = suscripcionRepository.findById(idSuscripcion);
        if (opt.isPresent()) {
            Suscripcion s = opt.get();
            s.setStatus(newStatus);
            s.setFechaUltimaModificacion(LocalDateTime.now());
            return suscripcionRepository.save(s);
        }
        return null;
    }

    public Suscripcion extenderFecha(@NonNull Integer idSuscripcion, LocalDateTime nuevaFecha) {
        Optional<Suscripcion> opt = suscripcionRepository.findById(idSuscripcion);
        if (opt.isPresent()) {
            Suscripcion s = opt.get();
            s.setFechaFin(nuevaFecha);
            s.setFechaUltimaModificacion(LocalDateTime.now());
            return suscripcionRepository.save(s);
        }
        return null;
    }
}
