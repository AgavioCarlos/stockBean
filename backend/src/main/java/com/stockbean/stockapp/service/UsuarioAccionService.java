package com.stockbean.stockapp.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stockbean.stockapp.dto.GuardarAccionRequest;
import com.stockbean.stockapp.dto.UsuarioAccionDTO;
import com.stockbean.stockapp.model.admin.Empresa;
import com.stockbean.stockapp.model.admin.Pantallas;
import com.stockbean.stockapp.model.admin.AdminUsuarioPantalla;
import com.stockbean.stockapp.model.tablas.Usuario;
import com.stockbean.stockapp.repository.UsuarioPantallaRepository;
import com.stockbean.stockapp.repository.UsuarioRepository;

@Service
public class UsuarioAccionService {

    private static final Logger log = LoggerFactory.getLogger(UsuarioAccionService.class);

    @Autowired
    private UsuarioPantallaRepository adminUsuarioPantallaRepository;

    @Autowired
    private PantallaService pantallaService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Obtiene la matriz de permisos de un usuario en una empresa.
     * Filtra las pantallas según el rol del usuario que administra (por esRoot).
     */
    public List<UsuarioAccionDTO> obtenerMatrizPermisos(Integer idUsuario, Integer idEmpresa) {
        log.info("=== obtenerMatrizPermisos - idUsuario={}, idEmpresa={} ===", idUsuario, idEmpresa);

        Usuario usuario = usuarioRepository.findById(idUsuario).orElse(null);
        if (usuario == null) {
            log.warn("  [!] Usuario con id={} NO found in DB. Returning empty list.", idUsuario);
            return new ArrayList<>();
        }

        log.info("  [OK] Usuario encontrado: cuenta={}, id_rol={}", usuario.getCuenta(), usuario.getId_rol());

        // Obtener pantallas filtradas por esRoot según el rol del usuario
        List<Pantallas> pantallasDisponibles = pantallaService.findPantallasByRol(usuario.getId_rol());
        log.info("  [OK] Pantallas disponibles para rol {}: {} pantallas", usuario.getId_rol(),
                pantallasDisponibles.size());
        pantallasDisponibles.forEach(p -> log.info("       -> Pantalla: id={}, nombre='{}', status={}, esRoot={}",
                p.getIdPantalla(), p.getNombre(), p.getStatus(), p.getEsRoot()));

        List<AdminUsuarioPantalla> permisosActuales = adminUsuarioPantallaRepository
                .findByUsuarioIdAndEmpresaId(idUsuario, idEmpresa);
        log.info("  [OK] Permisos en admin_usuario_pantalla para idUsuario={}, idEmpresa={}: {} registros",
                idUsuario, idEmpresa, permisosActuales.size());
        permisosActuales.forEach(
                p -> log.info("       -> Permiso: id={}, pantalla={}, ver={}, guardar={}, actualizar={}, eliminar={}",
                        p.getIdUsuarioPantalla(),
                        p.getPantalla() != null ? p.getPantalla().getNombre() : "NULL",
                        p.getVer(), p.getGuardar(), p.getActualizar(), p.getEliminar()));

        List<UsuarioAccionDTO> matriz = new ArrayList<>();

        for (Pantallas pantalla : pantallasDisponibles) {
            if (!Boolean.TRUE.equals(pantalla.getStatus())) {
                log.debug("  [SKIP] Pantalla '{}' está inactiva (status=false)", pantalla.getNombre());
                continue;
            }

            UsuarioAccionDTO fila = new UsuarioAccionDTO();
            fila.setIdPantalla(pantalla.getIdPantalla());
            fila.setPantallaNombre(pantalla.getNombre());
            fila.setPantallaClave(pantalla.getClave());

            List<UsuarioAccionDTO.AccionItemDTO> accionesDTO = new ArrayList<>();

            AdminUsuarioPantalla pActual = permisosActuales.stream()
                    .filter(p -> p.getPantalla() != null
                            && p.getPantalla().getIdPantalla().equals(pantalla.getIdPantalla()))
                    .findFirst().orElse(null);

            if (pActual == null) {
                log.debug("  [INFO] Pantalla '{}' no tiene fila en admin_usuario_pantalla -> todos false",
                        pantalla.getNombre());
            }

            // 4 acciones basadas en la estructura de admin_usuario_pantalla
            // 1:view, 2:create, 3:update, 4:delete
            accionesDTO.add(new UsuarioAccionDTO.AccionItemDTO(1, "view",
                    pActual != null && Boolean.TRUE.equals(pActual.getVer())));
            accionesDTO.add(new UsuarioAccionDTO.AccionItemDTO(2, "create",
                    pActual != null && Boolean.TRUE.equals(pActual.getGuardar())));
            accionesDTO.add(new UsuarioAccionDTO.AccionItemDTO(3, "update",
                    pActual != null && Boolean.TRUE.equals(pActual.getActualizar())));
            accionesDTO.add(new UsuarioAccionDTO.AccionItemDTO(4, "delete",
                    pActual != null && Boolean.TRUE.equals(pActual.getEliminar())));

            fila.setAcciones(accionesDTO);
            matriz.add(fila);
        }

        log.info("  [RESULT] Matriz final: {} filas a retornar", matriz.size());
        return matriz;
    }

    /**
     * Guarda/actualiza masivamente los permisos de un usuario en una empresa.
     */
    @Transactional
    public void guardarPermisos(Integer idUsuario, Integer idEmpresa, List<GuardarAccionRequest> permisos) {
        log.info("=== guardarPermisos - idUsuario={}, idEmpresa={}, {} items ===", idUsuario, idEmpresa,
                permisos.size());

        List<AdminUsuarioPantalla> actuales = adminUsuarioPantallaRepository.findByUsuarioIdAndEmpresaId(idUsuario,
                idEmpresa);

        for (GuardarAccionRequest req : permisos) {
            AdminUsuarioPantalla existente = actuales.stream()
                    .filter(p -> p.getPantalla() != null && p.getPantalla().getIdPantalla().equals(req.getIdPantalla()))
                    .findFirst().orElse(null);

            if (existente == null) {
                existente = new AdminUsuarioPantalla();
                Usuario usuario = new Usuario();
                usuario.setId_usuario(idUsuario);
                existente.setUsuario(usuario);

                Empresa empresa = new Empresa();
                empresa.setIdEmpresa(idEmpresa);
                existente.setEmpresa(empresa);

                Pantallas pantalla = new Pantallas();
                pantalla.setIdPantalla(req.getIdPantalla());
                existente.setPantalla(pantalla);

                existente.setVer(false);
                existente.setGuardar(false);
                existente.setActualizar(false);
                existente.setEliminar(false);

                actuales.add(existente);
                log.info("  [NEW] Creando nuevo permiso para pantalla id={}", req.getIdPantalla());
            }

            // Aplicar cambios según la acción (1=ver, 2=crear, 3=actualizar, 4=eliminar)
            boolean permitido = Boolean.TRUE.equals(req.getPermitido());
            switch (req.getIdAccion()) {
                case 1:
                    existente.setVer(permitido);
                    break;
                case 2:
                    existente.setGuardar(permitido);
                    break;
                case 3:
                    existente.setActualizar(permitido);
                    break;
                case 4:
                    existente.setEliminar(permitido);
                    break;
            }

            adminUsuarioPantallaRepository.save(existente);
        }
        log.info("  [DONE] guardarPermisos completado.");
    }
}