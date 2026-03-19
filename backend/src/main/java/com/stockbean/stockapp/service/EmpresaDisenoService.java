package com.stockbean.stockapp.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.stockbean.stockapp.model.admin.EmpresaDiseno;
import com.stockbean.stockapp.repository.EmpresaDisenoRepository;

@Service
public class EmpresaDisenoService {

    @Autowired
    private EmpresaDisenoRepository repository;

    @Transactional
    public Optional<EmpresaDiseno> obtenerDisenoPorEmpresa(Integer idEmpresa) {
        Optional<EmpresaDiseno> diseno = repository.findByEmpresaIdEmpresa(idEmpresa);
        if (diseno.isPresent()) {
            return diseno;
        }

        // Si no existe, creamos el registro por defecto y lo devolvemos
        EmpresaDiseno defaultDiseno = new EmpresaDiseno();
        
        // Es necesario vincularlo a la empresa (Se asume que la FK es a través de asociar el id_empresa)
        com.stockbean.stockapp.model.admin.Empresa empresa = new com.stockbean.stockapp.model.admin.Empresa();
        empresa.setIdEmpresa(idEmpresa);
        defaultDiseno.setEmpresa(empresa);

        defaultDiseno.setColorPrimario("#3b82f6");
        defaultDiseno.setColorSecundario("#1e293b");
        defaultDiseno.setColorAcento("#f59e0b");
        defaultDiseno.setColorFondo("#f8fafc");
        defaultDiseno.setFuenteFamilia("'Instrument Sans', system-ui, sans-serif");
        defaultDiseno.setEstiloBoton("rounded-md");
        defaultDiseno.setRedondeoComponentes("0.375rem");
        defaultDiseno.setTemaOscuroHabilitado(false);
        defaultDiseno.setFechaAlta(LocalDateTime.now());
        defaultDiseno.setFechaUltimaModificacion(LocalDateTime.now());
        
        return Optional.of(repository.save(defaultDiseno));
    }

    @Transactional
    public EmpresaDiseno guardarODiseno(EmpresaDiseno diseno) {
        if (diseno.getIdDiseno() == null) {
            diseno.setFechaAlta(LocalDateTime.now());
        }
        diseno.setFechaUltimaModificacion(LocalDateTime.now());
        return repository.save(diseno);
    }

    @Transactional
    public EmpresaDiseno actualizarDiseno(Integer idEmpresa, EmpresaDiseno disenoActualizado) {
        EmpresaDiseno disenoExistente = repository.findByEmpresaIdEmpresa(idEmpresa)
                .orElseThrow(() -> new RuntimeException("No se encontró diseño para la empresa con ID: " + idEmpresa));

        disenoExistente.setColorPrimario(disenoActualizado.getColorPrimario());
        disenoExistente.setColorSecundario(disenoActualizado.getColorSecundario());
        disenoExistente.setColorAcento(disenoActualizado.getColorAcento());
        disenoExistente.setColorFondo(disenoActualizado.getColorFondo());
        disenoExistente.setUrlLogo(disenoActualizado.getUrlLogo());
        disenoExistente.setUrlFavicon(disenoActualizado.getUrlFavicon());
        disenoExistente.setFuenteFamilia(disenoActualizado.getFuenteFamilia());
        disenoExistente.setEstiloBoton(disenoActualizado.getEstiloBoton());
        disenoExistente.setRedondeoComponentes(disenoActualizado.getRedondeoComponentes());
        disenoExistente.setTemaOscuroHabilitado(disenoActualizado.getTemaOscuroHabilitado());
        disenoExistente.setFechaUltimaModificacion(LocalDateTime.now());
        disenoExistente.setUsuarioModifico(disenoActualizado.getUsuarioModifico());

        return repository.save(disenoExistente);
    }

    @Transactional
    public String guardarLogo(Integer idEmpresa, MultipartFile file) throws Exception {
        EmpresaDiseno disenoExistente = repository.findByEmpresaIdEmpresa(idEmpresa)
                .orElseThrow(() -> new RuntimeException("No se encontró diseño para la empresa con ID: " + idEmpresa));

        // Ruta absoluta solicitada
        Path basePath = Paths.get("c:", "stockapp", "stockBean", "frontend", "w-stockapp", "src", "assets", "logos", String.valueOf(idEmpresa));

        if (!Files.exists(basePath)) {
            Files.createDirectories(basePath);
        }

        // Eliminar existente si existe y no es http
        if (StringUtils.hasText(disenoExistente.getUrlLogo()) && !disenoExistente.getUrlLogo().startsWith("http")) {
            Path oldFile = basePath.resolve(disenoExistente.getUrlLogo());
            Files.deleteIfExists(oldFile);
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "logo.png");
        String fileName = System.currentTimeMillis() + "_" + originalFilename;

        Path targetLocation = basePath.resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        disenoExistente.setUrlLogo(fileName);
        disenoExistente.setFechaUltimaModificacion(LocalDateTime.now());
        repository.save(disenoExistente);

        return fileName;
    }
}
