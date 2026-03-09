package com.stockbean.stockapp.service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.stockbean.stockapp.dto.JerarquiaPermisosDTO;
import com.stockbean.stockapp.dto.PermisoDetalleDTO;
import com.stockbean.stockapp.model.admin.Pantallas;
import com.stockbean.stockapp.model.admin.PantallasPermisos;
import com.stockbean.stockapp.model.catalogos.Permiso;
import com.stockbean.stockapp.model.catalogos.Rol;
import com.stockbean.stockapp.model.tablas.RolPermisos;
import com.stockbean.stockapp.repository.PantallasPermisosRepository;
import com.stockbean.stockapp.repository.RolPermisosRepository;
import com.stockbean.stockapp.repository.RolRepository;
import com.stockbean.stockapp.repository.PantallaRepository;
import com.stockbean.stockapp.repository.PermisoRepository;
import com.stockbean.stockapp.dto.PantallaAsignacionDTO;
import com.stockbean.stockapp.dto.RolAsignacionDTO;
import com.stockbean.stockapp.model.admin.PantallasPermisosId;

@Service
public class RolesPermisosService {

    @Autowired
    private PantallasPermisosRepository pantallasPermisosRepository;

    @Autowired
    private RolPermisosRepository rolPermisosRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PantallaRepository pantallaRepository;

    @Autowired
    private PermisoRepository permisoRepository;

    public Permiso crearPermiso(Permiso permiso) {
        permiso.setFechaAlta(java.time.LocalDateTime.now());
        permiso.setFechaUltimaModificacion(java.time.LocalDateTime.now());
        return permisoRepository.save(permiso);
    }

    public List<Permiso> obtenerTodosLosPermisos() {
        return permisoRepository.findAll();
    }

    public List<PantallaAsignacionDTO> obtenerPantallasPorPermiso(Integer idPermiso) {
        List<Pantallas> allPantallas = pantallaRepository.findAll();
        List<Integer> assignedPantallaIds = pantallasPermisosRepository.findByPermiso_IdPermiso(idPermiso)
                .stream().map(pp -> pp.getPantalla().getIdPantalla()).collect(Collectors.toList());

        return allPantallas.stream().map(p -> new PantallaAsignacionDTO(
                p.getIdPantalla(),
                p.getNombre(),
                p.getRuta(),
                p.getClave(), // Usando clave como modulo
                assignedPantallaIds.contains(p.getIdPantalla()))).collect(Collectors.toList());
    }

    @Transactional
    public void actualizarPantallasPorPermiso(@NonNull Integer idPermiso, List<Integer> idPantallas) {
        Permiso permiso = permisoRepository.findById(idPermiso)
                .orElseThrow(() -> new RuntimeException("Permiso no encontrado"));

        pantallasPermisosRepository.deleteAllByPermisoId(idPermiso);

        List<PantallasPermisos> newList = new ArrayList<>();
        for (Integer idP : idPantallas) {
            Pantallas p = new Pantallas();
            p.setIdPantalla(idP);

            PantallasPermisos pp = new PantallasPermisos();
            PantallasPermisosId id = new PantallasPermisosId(idP, idPermiso);
            pp.setId(id);
            pp.setPantalla(p);
            pp.setPermiso(permiso);
            pp.setStatus(true);

            newList.add(pp);
        }

        pantallasPermisosRepository.saveAll(newList);
    }

    public List<RolAsignacionDTO> obtenerRolesPorPermiso(Integer idPermiso) {
        List<Rol> allRoles = rolRepository.findAll();
        List<Integer> assignedRoleIds = rolPermisosRepository.findByPermisoIdAndFechaBajaIsNull(idPermiso)
                .stream().map(rp -> rp.getRol().getId_rol()).collect(Collectors.toList());

        return allRoles.stream().map(r -> new RolAsignacionDTO(
                r.getId_rol(),
                r.getNombre(),
                r.getDescripcion(),
                assignedRoleIds.contains(r.getId_rol()))).collect(Collectors.toList());
    }

    @Transactional
    public void actualizarRolesPorPermiso(@NonNull Integer idPermiso, List<Integer> idRoles) {
        Permiso permiso = permisoRepository.findById(idPermiso)
                .orElseThrow(() -> new RuntimeException("Permiso no encontrado"));

        rolPermisosRepository.deleteAllByPermisoId(idPermiso);

        Timestamp now = new Timestamp(System.currentTimeMillis());
        List<RolPermisos> newList = new ArrayList<>();

        for (Integer idRol : idRoles) {
            Rol r = new Rol();
            r.setId_rol(idRol);

            RolPermisos rp = new RolPermisos();
            rp.setRol(r);
            rp.setPermiso(permiso);
            rp.setFechaAlta(now);
            rp.setFechaUltimaModificacion(now);

            newList.add(rp);
        }

        rolPermisosRepository.saveAll(newList);
    }

    public List<JerarquiaPermisosDTO> obtenerArbol(Integer idRol) {
        List<PantallasPermisos> allPermisos = pantallasPermisosRepository.findAllWithRelations();

        List<Integer> assignedPermisosIds = rolPermisosRepository.findByRolIdAndFechaBajaIsNull(idRol)
                .stream().map(rp -> rp.getPermiso().getIdPermiso())
                .collect(Collectors.toList());

        Map<Pantallas, List<PantallasPermisos>> grouped = allPermisos.stream()
                .filter(pp -> pp.getStatus() != null && pp.getStatus())
                .collect(Collectors.groupingBy(PantallasPermisos::getPantalla));

        List<JerarquiaPermisosDTO> result = new ArrayList<>();

        for (Map.Entry<Pantallas, List<PantallasPermisos>> entry : grouped.entrySet()) {
            Pantallas p = entry.getKey();
            List<PermisoDetalleDTO> pDetails = entry.getValue().stream().map(pp -> {
                Permiso perm = pp.getPermiso();
                return new PermisoDetalleDTO(
                        perm.getIdPermiso(),
                        perm.getNombre(),
                        assignedPermisosIds.contains(perm.getIdPermiso()));
            }).collect(Collectors.toList());

            result.add(new JerarquiaPermisosDTO(
                    p.getIdPantalla(),
                    p.getNombre(),
                    p.getRuta(),
                    p.getClave(),
                    p.getIcono(),
                    pDetails));
        }

        return result;
    }

    @Transactional
    public void actualizarPermisos(@NonNull Integer idRol, List<Integer> idPermisos) {
        Rol rol = rolRepository.findById(idRol).orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        rolPermisosRepository.deleteAllByRolId(idRol);

        Timestamp now = new Timestamp(System.currentTimeMillis());
        List<RolPermisos> newPermisos = new ArrayList<>();

        for (Integer idPerm : idPermisos) {
            Permiso p = new Permiso();
            p.setIdPermiso(idPerm);

            RolPermisos rp = new RolPermisos();
            rp.setRol(rol);
            rp.setPermiso(p);
            rp.setFechaAlta(now);
            rp.setFechaUltimaModificacion(now);
            newPermisos.add(rp);
        }

        rolPermisosRepository.saveAll(newPermisos);
    }
}
