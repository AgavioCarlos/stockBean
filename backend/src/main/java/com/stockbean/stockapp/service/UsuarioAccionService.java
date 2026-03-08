package com.stockbean.stockapp.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stockbean.stockapp.dto.GuardarAccionRequest;
import com.stockbean.stockapp.dto.UsuarioAccionDTO;
import com.stockbean.stockapp.model.admin.Empresa;
import com.stockbean.stockapp.model.admin.Pantallas;
import com.stockbean.stockapp.model.admin.UsuarioAccion;
import com.stockbean.stockapp.model.catalogos.Accion;
import com.stockbean.stockapp.model.tablas.Usuario;
import com.stockbean.stockapp.repository.AccionRepository;
import com.stockbean.stockapp.repository.PantallaRepository;
import com.stockbean.stockapp.repository.UsuarioAccionRepository;

@Service
public class UsuarioAccionService {

    @Autowired
    private UsuarioAccionRepository usuarioAccionRepository;

    @Autowired
    private PantallaRepository pantallaRepository;

    @Autowired
    private AccionRepository accionRepository;

    /**
     * Obtiene la matriz de permisos de un usuario en una empresa.
     * Devuelve TODAS las pantallas con TODAS las acciones, indicando cuáles están
     * permitidas.
     */
    public List<UsuarioAccionDTO> obtenerMatrizPermisos(Integer idUsuario, Integer idEmpresa) {
        List<Pantallas> todasPantallas = pantallaRepository.findAll();
        List<Accion> todasAcciones = accionRepository.findByStatusTrue();
        List<UsuarioAccion> permisosActuales = usuarioAccionRepository
                .buscarPermisosActivosPorUsuarioYEmpresa(idUsuario, idEmpresa);

        List<UsuarioAccionDTO> matriz = new ArrayList<>();

        for (Pantallas pantalla : todasPantallas) {
            if (!Boolean.TRUE.equals(pantalla.getStatus()))
                continue; // Omitir pantallas inactivas

            UsuarioAccionDTO fila = new UsuarioAccionDTO();
            fila.setIdPantalla(pantalla.getIdPantalla());
            fila.setPantallaNombre(pantalla.getNombre());
            fila.setPantallaClave(pantalla.getClave());

            List<UsuarioAccionDTO.AccionItemDTO> accionesDTO = new ArrayList<>();
            for (Accion accion : todasAcciones) {
                boolean permitido = permisosActuales.stream().anyMatch(
                        ua -> ua.getPantalla().getIdPantalla().equals(pantalla.getIdPantalla())
                                && ua.getAccion().getIdAccion().equals(accion.getIdAccion())
                                && Boolean.TRUE.equals(ua.getPermitido()));

                accionesDTO.add(new UsuarioAccionDTO.AccionItemDTO(
                        accion.getIdAccion(),
                        accion.getNombre(),
                        permitido));
            }
            fila.setAcciones(accionesDTO);
            matriz.add(fila);
        }

        return matriz;
    }

    /**
     * Guarda/actualiza masivamente los permisos de un usuario en una empresa.
     * Si el registro ya existe, lo actualiza. Si no, lo crea.
     */
    @Transactional
    public void guardarPermisos(Integer idUsuario, Integer idEmpresa, List<GuardarAccionRequest> permisos) {
        for (GuardarAccionRequest req : permisos) {
            Optional<UsuarioAccion> existente = usuarioAccionRepository.buscarPermisoExacto(
                    idUsuario, idEmpresa, req.getIdPantalla(), req.getIdAccion());

            if (existente.isPresent()) {
                UsuarioAccion ua = existente.get();
                ua.setPermitido(req.getPermitido());
                ua.setStatus(true);
                usuarioAccionRepository.save(ua);
            } else if (Boolean.TRUE.equals(req.getPermitido())) {
                // Solo crear si se está habilitando el permiso
                UsuarioAccion ua = new UsuarioAccion();

                Usuario usuario = new Usuario();
                usuario.setId_usuario(idUsuario);
                ua.setUsuario(usuario);

                Empresa empresa = new Empresa();
                empresa.setIdEmpresa(idEmpresa);
                ua.setEmpresa(empresa);

                Pantallas pantalla = new Pantallas();
                pantalla.setIdPantalla(req.getIdPantalla());
                ua.setPantalla(pantalla);

                Accion accion = new Accion();
                accion.setIdAccion(req.getIdAccion());
                ua.setAccion(accion);

                ua.setPermitido(true);
                ua.setStatus(true);
                ua.setFechaAlta(LocalDateTime.now());

                usuarioAccionRepository.save(ua);
            }
        }
    }
}
