package com.stockbean.stockapp.service;

import java.util.ArrayList;
import java.util.List;

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
        Usuario usuario = usuarioRepository.findById(idUsuario).orElse(null);
        if (usuario == null) return new ArrayList<>();

        // Obtener pantallas filtradas por esRoot según el rol del usuario
        List<Pantallas> pantallasDisponibles = pantallaService.findPantallasByRol(usuario.getId_rol());

        List<AdminUsuarioPantalla> permisosActuales = adminUsuarioPantallaRepository
                .findByUsuarioIdAndEmpresaId(idUsuario, idEmpresa);

        List<UsuarioAccionDTO> matriz = new ArrayList<>();

        for (Pantallas pantalla : pantallasDisponibles) {
            if (!Boolean.TRUE.equals(pantalla.getStatus()))
                continue;

            UsuarioAccionDTO fila = new UsuarioAccionDTO();
            fila.setIdPantalla(pantalla.getIdPantalla());
            fila.setPantallaNombre(pantalla.getNombre());
            fila.setPantallaClave(pantalla.getClave());

            List<UsuarioAccionDTO.AccionItemDTO> accionesDTO = new ArrayList<>();

            AdminUsuarioPantalla pActual = permisosActuales.stream()
                .filter(p -> p.getPantalla() != null && p.getPantalla().getIdPantalla().equals(pantalla.getIdPantalla()))
                .findFirst().orElse(null);

            // 4 acciones basadas en la estructura de admin_usuario_pantalla
            // 1:view, 2:create, 3:update, 4:delete
            accionesDTO.add(new UsuarioAccionDTO.AccionItemDTO(1, "view", pActual != null && Boolean.TRUE.equals(pActual.getVer())));
            accionesDTO.add(new UsuarioAccionDTO.AccionItemDTO(2, "create", pActual != null && Boolean.TRUE.equals(pActual.getGuardar())));
            accionesDTO.add(new UsuarioAccionDTO.AccionItemDTO(3, "update", pActual != null && Boolean.TRUE.equals(pActual.getActualizar())));
            accionesDTO.add(new UsuarioAccionDTO.AccionItemDTO(4, "delete", pActual != null && Boolean.TRUE.equals(pActual.getEliminar())));

            fila.setAcciones(accionesDTO);
            matriz.add(fila);
        }

        return matriz;
    }

    /**
     * Guarda/actualiza masivamente los permisos de un usuario en una empresa.
     */
    @Transactional
    public void guardarPermisos(Integer idUsuario, Integer idEmpresa, List<GuardarAccionRequest> permisos) {
        List<AdminUsuarioPantalla> actuales = adminUsuarioPantallaRepository.findByUsuarioIdAndEmpresaId(idUsuario, idEmpresa);
        
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
            }

            // Aplicar cambios según la acción (1=ver, 2=crear, 3=actualizar, 4=eliminar)
            boolean permitido = Boolean.TRUE.equals(req.getPermitido());
            switch(req.getIdAccion()) {
                case 1: existente.setVer(permitido); break;
                case 2: existente.setGuardar(permitido); break;
                case 3: existente.setActualizar(permitido); break;
                case 4: existente.setEliminar(permitido); break;
            }

            adminUsuarioPantallaRepository.save(existente);
        }
    }
}