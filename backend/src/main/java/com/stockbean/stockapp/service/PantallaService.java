package com.stockbean.stockapp.service;

import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.stockbean.stockapp.dto.PantallaDTO;
import com.stockbean.stockapp.model.admin.AdminUsuarioPantalla;
import com.stockbean.stockapp.model.admin.Pantallas;
import com.stockbean.stockapp.repository.UsuarioPantallaRepository;
import com.stockbean.stockapp.repository.PantallaRepository;

@Service
public class PantallaService {

    private static final Logger log = LoggerFactory.getLogger(PantallaService.class);

    @Autowired
    private PantallaRepository pantallaRepository;

    @Autowired
    private UsuarioPantallaRepository adminUsuarioPantallaRepository;

    /**
     * Pantallas del menú lateral del usuario.
     * Lee de admin_usuario_pantalla donde ver = true, y convierte a PantallaDTO.
     * Solo incluye pantallas activas (status = true).
     *
     * @param idUsuario ID del usuario autenticado
     * @param idEmpresa ID de la empresa activa (puede ser null para Sistemas)
     */
    public List<PantallaDTO> findPantallasUsuario(Integer idUsuario, Integer idEmpresa) {
        List<AdminUsuarioPantalla> permisos;

        if (idEmpresa != null) {
            permisos = adminUsuarioPantallaRepository.findByUsuarioIdAndEmpresaId(idUsuario, idEmpresa);
        } else {
            permisos = adminUsuarioPantallaRepository.findByUsuarioId(idUsuario);
            System.out.println("Permisos: " + permisos);
        }

        return permisos.stream()
                .filter(p -> Boolean.TRUE.equals(p.getVer()))
                .filter(p -> p.getPantalla() != null)
                .filter(p -> Boolean.TRUE.equals(p.getPantalla().getStatus()))
                .map(p -> {
                    Pantallas pt = p.getPantalla();
                    return new PantallaDTO(
                            pt.getIdPantalla(),
                            pt.getClave(),
                            pt.getNombre(),
                            pt.getRuta(),
                            pt.getIcono(),
                            pt.getOrden(),
                            pt.getIdPadre(),
                            pt.getEsMenu());
                })
                .distinct()
                .sorted((a, b) -> {
                    int oa = a.getOrden() != null ? a.getOrden() : 999;
                    int ob = b.getOrden() != null ? b.getOrden() : 999;
                    return Integer.compare(oa, ob);
                })
                .collect(Collectors.toList());
    }

    /**
     * Pantallas activas filtradas por esRoot:
     * - Sistemas (rol 1): esRoot = true
     * - Otros roles: esRoot IS NULL o false
     */
    public List<Pantallas> findPantallasByRol(Integer idRol) {
        if (idRol != null && idRol == 1) {
            List<Pantallas> result = pantallaRepository.findAllRoot();
            log.info("[PantallaService] findPantallasByRol idRol={} -> ROOT query -> {} pantallas", idRol,
                    result.size());
            return result;
        }
        List<Pantallas> result = pantallaRepository.findAllNoRoot();
        log.info("[PantallaService] findPantallasByRol idRol={} -> NO-ROOT query -> {} pantallas", idRol,
                result.size());
        return result;
    }

    /**
     * Todas las pantallas activas (sin filtro de esRoot).
     */
    public List<Pantallas> findAllActivas() {
        return pantallaRepository.findAllActivas();
    }

    public Pantallas getPantalla(Integer id) {
        return pantallaRepository.findById(id).orElse(null);
    }
    
    public Pantallas save(Pantallas p) {
        if (p.getIdPantalla() == null) {
            p.setFechaAlta(LocalDateTime.now());
            p.setStatus(true);
        }
        if (p.getOrden() == null) {
            if (p.getIdPadre() != null) {
                p.setOrden(pantallaRepository.findMaxOrdenByIdPadre(p.getIdPadre()) + 1);
            } else {
                p.setOrden(pantallaRepository.findMaxOrdenRoot() + 1);
            }
        }
        return pantallaRepository.save(p);
    }

    public void delete(Integer id) {
        pantallaRepository.findById(id).ifPresent(p -> {
            p.setStatus(false);
            p.setFechaBaja(LocalDateTime.now());
            pantallaRepository.save(p);
        });
    }

    public List<Pantallas> findPadres() {
        return pantallaRepository.findPadres();
    }
}
