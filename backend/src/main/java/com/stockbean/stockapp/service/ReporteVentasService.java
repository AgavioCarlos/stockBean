package com.stockbean.stockapp.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.stockbean.stockapp.dto.DashboardStatsDTO;
import com.stockbean.stockapp.dto.VentaReporteDTO;
import com.stockbean.stockapp.dto.VentasPorDiaDTO;
import com.stockbean.stockapp.model.tablas.DetalleVenta;
import com.stockbean.stockapp.model.tablas.Sucursal;
import com.stockbean.stockapp.model.tablas.Usuario;
import com.stockbean.stockapp.model.tablas.Venta;
import com.stockbean.stockapp.repository.DetalleVentaRepository;
import com.stockbean.stockapp.repository.EmpresaUsuarioRepository;
import com.stockbean.stockapp.repository.SucursalRepository;
import com.stockbean.stockapp.repository.UsuarioRepository;
import com.stockbean.stockapp.repository.UsuarioSucursalRepository;
import com.stockbean.stockapp.repository.VentaRepository;
import java.util.Objects;

import lombok.NonNull;

@Service
public class ReporteVentasService {

    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private DetalleVentaRepository detalleVentaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private SucursalRepository sucursalRepository;

    @Autowired
    private EmpresaUsuarioRepository empresaUsuarioRepository;

    @Autowired
    private UsuarioSucursalRepository usuarioSucursalRepository;

    /**
     * Obtiene el reporte de ventas según el rol del usuario:
     * - SISTEM: Todas las ventas
     * - ADMIN: Ventas de las sucursales de su empresa
     * - GERENTE/CAJERO: Ventas de sus sucursales asignadas
     */
    public List<VentaReporteDTO> obtenerReporteVentas(@NonNull Integer idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + idUsuario));

        String rol = usuario.getNombre_rol();
        if (rol == null) {
            throw new RuntimeException("El usuario no tiene un rol asignado.");
        }

        List<Venta> ventas;
        Map<Integer, String> sucursalNames;

        if ("SISTEM".equalsIgnoreCase(rol)) {
            ventas = ventaRepository.findAllWithMetodoPago();
            sucursalNames = sucursalRepository.findAll().stream()
                    .collect(Collectors.toMap(Sucursal::getId_sucursal, Sucursal::getNombre, (a, b) -> a));
        } else if ("ADMIN".equalsIgnoreCase(rol)) {
            List<Integer> companyIds = empresaUsuarioRepository.findIdEmpresaByUsuarioId(idUsuario);
            if (companyIds.isEmpty())
                return Collections.emptyList();

            List<Sucursal> sucursales = sucursalRepository.findByEmpresaId(companyIds.get(0));
            List<Integer> idsSucursales = sucursales.stream()
                    .map(Sucursal::getId_sucursal).collect(Collectors.toList());

            if (idsSucursales.isEmpty())
                return Collections.emptyList();

            ventas = ventaRepository.findBySucursalIds(idsSucursales);
            sucursalNames = sucursales.stream()
                    .collect(Collectors.toMap(Sucursal::getId_sucursal, Sucursal::getNombre, (a, b) -> a));
        } else {
            // GERENTE / CAJERO
            List<Integer> idsSucursales = usuarioSucursalRepository.findByStatusTrue().stream()
                    .filter(us -> us.getUsuario().getId_usuario().equals(idUsuario))
                    .map(us -> us.getSucursal().getId_sucursal())
                    .collect(Collectors.toList());

            if (idsSucursales.isEmpty())
                return Collections.emptyList();

            ventas = ventaRepository.findBySucursalIds(idsSucursales);
            sucursalNames = sucursalRepository.findAllById(idsSucursales).stream()
                    .collect(Collectors.toMap(Sucursal::getId_sucursal, Sucursal::getNombre, (a, b) -> a));
        }

        return convertToReportDTOs(ventas, sucursalNames);
    }

    /**
     * Obtiene un resumen consolidado para el Dashboard (Estadísticas de hoy vs
     * ayer).
     */
    public DashboardStatsDTO obtenerResumenDashboard(@NonNull Integer idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String rol = usuario.getNombre_rol();
        List<Integer> idsSucursales = new ArrayList<>();

        if ("SISTEM".equalsIgnoreCase(rol)) {
            // No restringir sucursales
        } else if ("ADMIN".equalsIgnoreCase(rol)) {
            List<Integer> companyIds = empresaUsuarioRepository.findIdEmpresaByUsuarioId(idUsuario);
            if (!companyIds.isEmpty()) {
                idsSucursales = sucursalRepository.findByEmpresaId(companyIds.get(0)).stream()
                        .map(Sucursal::getId_sucursal).collect(Collectors.toList());
            }
        } else {
            idsSucursales = usuarioSucursalRepository.findByStatusTrue().stream()
                    .filter(us -> us.getUsuario().getId_usuario().equals(idUsuario))
                    .map(us -> us.getSucursal().getId_sucursal())
                    .collect(Collectors.toList());
        }

        // Rangos de tiempo
        LocalDate hoy = LocalDate.now();
        LocalDateTime inicioHoy = hoy.atStartOfDay();
        LocalDateTime finHoy = hoy.atTime(LocalTime.MAX);

        LocalDate ayer = hoy.minusDays(1);
        LocalDateTime inicioAyer = ayer.atStartOfDay();
        LocalDateTime finAyer = ayer.atTime(LocalTime.MAX);

        List<Venta> ventasHoy;
        List<Venta> ventasAyer;

        if ("SISTEM".equalsIgnoreCase(rol)) {
            ventasHoy = ventaRepository.findByFechaVentaBetween(inicioHoy, finHoy);
            ventasAyer = ventaRepository.findByFechaVentaBetween(inicioAyer, finAyer);
        } else {
            if (idsSucursales.isEmpty()) {
                return emptyStats();
            }
            ventasHoy = ventaRepository.findBySucursalIdsAndFechaVentaBetween(idsSucursales, inicioHoy, finHoy);
            ventasAyer = ventaRepository.findBySucursalIdsAndFechaVentaBetween(idsSucursales, inicioAyer, finAyer);
        }

        // Cálculos HOY
        BigDecimal montoHoy = BigDecimal
                .valueOf(ventasHoy.stream().mapToLong(v -> v.getTotal() != null ? v.getTotal() : 0).sum());
        long conteoHoy = ventasHoy.size();
        long unidadesHoy = ventasHoy.stream().mapToLong(v -> {
            Long c = ventaRepository.sumCantidadByVentaId(v.getIdVenta());
            return c != null ? c : 0;
        }).sum();
        BigDecimal promedioHoy = conteoHoy > 0 ? montoHoy.divide(BigDecimal.valueOf(conteoHoy), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        // Cálculos AYER
        BigDecimal montoAyer = BigDecimal
                .valueOf(ventasAyer.stream().mapToLong(v -> v.getTotal() != null ? v.getTotal() : 0).sum());
        long conteoAyer = ventasAyer.size();
        long unidadesAyer = ventasAyer.stream().mapToLong(v -> {
            Long c = ventaRepository.sumCantidadByVentaId(v.getIdVenta());
            return c != null ? c : 0;
        }).sum();
        BigDecimal promedioAyer = conteoAyer > 0
                ? montoAyer.divide(BigDecimal.valueOf(conteoAyer), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        return DashboardStatsDTO.builder()
                .montoHoy(montoHoy)
                .trendMonto(calcularTendencia(montoHoy, montoAyer))
                .montoColor(getTrendColor(montoHoy, montoAyer))
                .conteoHoy(conteoHoy)
                .trendConteo(calcularTendencia(BigDecimal.valueOf(conteoHoy), BigDecimal.valueOf(conteoAyer)))
                .conteoColor(getTrendColor(BigDecimal.valueOf(conteoHoy), BigDecimal.valueOf(conteoAyer)))
                .unidadesHoy(unidadesHoy)
                .trendUnidades(calcularTendencia(BigDecimal.valueOf(unidadesHoy), BigDecimal.valueOf(unidadesAyer)))
                .unidadesColor(getTrendColor(BigDecimal.valueOf(unidadesHoy), BigDecimal.valueOf(unidadesAyer)))
                .promedioHoy(promedioHoy)
                .trendPromedio(calcularTendencia(promedioHoy, promedioAyer))
                .promedioColor(getTrendColor(promedioHoy, promedioAyer))
                .build();
    }

    private String calcularTendencia(BigDecimal hoy, BigDecimal ayer) {
        if (ayer.compareTo(BigDecimal.ZERO) == 0) {
            return hoy.compareTo(BigDecimal.ZERO) > 0 ? "+100%" : "0%";
        }
        BigDecimal diff = hoy.subtract(ayer)
                .divide(ayer, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
        return (diff.compareTo(BigDecimal.ZERO) > 0 ? "+" : "") + diff.setScale(1, RoundingMode.HALF_UP) + "%";
    }

    private String getTrendColor(BigDecimal hoy, BigDecimal ayer) {
        return hoy.compareTo(ayer) >= 0 ? "text-emerald-500 bg-emerald-50" : "text-rose-500 bg-rose-50";
    }

    private DashboardStatsDTO emptyStats() {
        return DashboardStatsDTO.builder()
                .montoHoy(BigDecimal.ZERO).trendMonto("0%").montoColor("text-slate-400 bg-slate-50")
                .conteoHoy(0L).trendConteo("0%").conteoColor("text-slate-400 bg-slate-50")
                .unidadesHoy(0L).trendUnidades("0%").unidadesColor("text-slate-400 bg-slate-50")
                .promedioHoy(BigDecimal.ZERO).trendPromedio("0%").promedioColor("text-slate-400 bg-slate-50")
                .build();
    }

    /**
     * Obtiene el reporte de ventas para una sucursal específica.
     */
    public List<VentaReporteDTO> obtenerReportePorSucursal(
            @NonNull Integer idSucursal, @NonNull Integer idUsuario) {

        // Validar acceso
        obtenerReporteVentas(idUsuario); // Throws if no access

        List<Venta> ventas = ventaRepository.findBySucursalId(idSucursal);
        Sucursal sucursal = sucursalRepository.findById(idSucursal)
                .orElseThrow(() -> new RuntimeException("Sucursal no encontrada con ID: " + idSucursal));

        Map<Integer, String> sucursalNames = Map.of(idSucursal, sucursal.getNombre());
        return convertToReportDTOs(ventas, sucursalNames);
    }

    // ─── Helpers ─────────────────────────────────────────────
    private List<VentaReporteDTO> convertToReportDTOs(
            List<Venta> ventas, Map<Integer, String> sucursalNames) {

        // Pre-cache users for performance
        Map<Integer, Usuario> userCache = new java.util.HashMap<>();

        List<VentaReporteDTO> reportes = new ArrayList<>();

        for (Venta v : ventas) {
            VentaReporteDTO dto = new VentaReporteDTO();
            dto.setIdVenta(v.getIdVenta());
            dto.setFechaVenta(v.getFechaVenta());
            dto.setIdSucursal(v.getIdSucursal());
            dto.setSucursal(sucursalNames.getOrDefault(v.getIdSucursal(), "Sucursal #" + v.getIdSucursal()));
            dto.setMetodoPago(v.getMetodoPago() != null ? v.getMetodoPago().getNombre() : "N/A");
            dto.setTotalVenta(BigDecimal.valueOf(v.getTotal() != null ? v.getTotal() : 0));

            // Nombre del cajero
            if (v.getIdUsuario() != null) {
                Usuario usr = userCache.computeIfAbsent(v.getIdUsuario(),
                        id -> usuarioRepository.findById(Objects.requireNonNull(id)).orElse(null));
                if (usr != null && usr.getPersona() != null) {
                    String nombre = usr.getPersona().getNombre();
                    String apPat = usr.getPersona().getApellido_paterno();
                    dto.setCajero((nombre != null ? nombre : "") + " " + (apPat != null ? apPat : ""));
                    dto.setCajero(dto.getCajero().trim());
                } else {
                    dto.setCajero(usr != null ? usr.getCuenta() : "Usuario #" + v.getIdUsuario());
                }
            } else {
                dto.setCajero("N/A");
            }

            // Cantidad de items en la venta
            Long itemCount = ventaRepository.countDetallesByVentaId(v.getIdVenta());
            dto.setCantidadItems(itemCount != null ? itemCount.intValue() : 0);

            // Total de productos vendidos
            Long totalProductos = ventaRepository.sumCantidadByVentaId(v.getIdVenta());
            dto.setTotalProductos(totalProductos != null ? totalProductos.intValue() : 0);

            reportes.add(dto);
        }

        return reportes;
    }

    /**
     * Obtiene un resumen histórico aglutinado por día (Últimos 30 días o total
     * disp)
     * Para ser mostrado en el perfil del usuario.
     */
    public List<VentasPorDiaDTO> obtenerVentasPorDia(@NonNull Integer idUsuario) {
        // Aprovechamos el método base para tener las ventas con las reglas de acceso
        // aplicadas
        List<VentaReporteDTO> reporteBase = obtenerReporteVentas(idUsuario);

        if (reporteBase.isEmpty())
            return Collections.emptyList();

        // Extraer los ids de venta permitidos
        List<Integer> allowedVentaIds = reporteBase.stream()
                .map(VentaReporteDTO::getIdVenta)
                .collect(Collectors.toList());

        // Obtener la entidad de las ventas origen
        List<Venta> findAllPermitidas = ventaRepository.findAllById(Objects.requireNonNull(allowedVentaIds));

        // Limitamos a los últimos 30 días para no sobrecargar el endpoint
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        List<Venta> recentVentas = findAllPermitidas.stream()
                .filter(v -> v.getFechaVenta() != null && v.getFechaVenta().toLocalDate().isAfter(thirtyDaysAgo)
                        || v.getFechaVenta().toLocalDate().isEqual(thirtyDaysAgo))
                .collect(Collectors.toList());

        if (recentVentas.isEmpty())
            return Collections.emptyList();

        List<Integer> recentVentaIds = recentVentas.stream().map(Venta::getIdVenta).collect(Collectors.toList());

        // Para encontrar los productos Top, traemos todos sus detalles
        List<DetalleVenta> detalles = detalleVentaRepository.findByVentaIds(recentVentaIds);

        // Agrupamos por Fecha (yyyy-MM-dd) a Venta
        Map<LocalDate, List<Venta>> ventasPorFecha = recentVentas.stream()
                .collect(Collectors.groupingBy(v -> v.getFechaVenta().toLocalDate()));

        // Agrupamos Detalles por Venta
        Map<Integer, List<DetalleVenta>> detallesPorVentaId = detalles.stream()
                .filter(d -> d.getVenta() != null && d.getVenta().getIdVenta() != null)
                .collect(Collectors.groupingBy(d -> d.getVenta().getIdVenta()));

        List<VentasPorDiaDTO> resultado = new ArrayList<>();

        // Procesar día por día
        for (Map.Entry<LocalDate, List<Venta>> entry : ventasPorFecha.entrySet()) {
            LocalDate fecha = entry.getKey();
            List<Venta> ventasDelDia = entry.getValue();

            BigDecimal totalMonto = BigDecimal.ZERO;
            int totalCantidadDelDia = 0;

            // Para calcular el producto Top del dia
            Map<String, Integer> cantidadesPorProducto = new java.util.HashMap<>();

            for (Venta v : ventasDelDia) {
                // Sumar monto de la Venta a este día
                totalMonto = totalMonto.add(BigDecimal.valueOf(v.getTotal() != null ? v.getTotal() : 0));

                List<DetalleVenta> detallesVenta = detallesPorVentaId.getOrDefault(v.getIdVenta(),
                        Collections.emptyList());
                for (DetalleVenta dv : detallesVenta) {
                    int c = dv.getCantidad() != null ? dv.getCantidad() : 0;
                    totalCantidadDelDia += c;

                    if (dv.getProducto() != null && dv.getProducto().getNombre() != null) {
                        String prodName = dv.getProducto().getNombre();
                        cantidadesPorProducto.put(prodName, cantidadesPorProducto.getOrDefault(prodName, 0) + c);
                    }
                }
            }

            // Calcular Top Producto
            String topProducto = "N/A";
            if (!cantidadesPorProducto.isEmpty()) {
                topProducto = cantidadesPorProducto.entrySet().stream()
                        .max(Map.Entry.comparingByValue())
                        .map(Map.Entry::getKey)
                        .orElse("N/A");
            }

            resultado.add(VentasPorDiaDTO.builder()
                    .fecha(fecha.toString())
                    .topProducto(topProducto)
                    .cantidad(totalCantidadDelDia)
                    .totalVentas(totalMonto)
                    .build());
        }

        // Ordenar de más reciente a más antiguo
        resultado.sort((a, b) -> b.getFecha().compareTo(a.getFecha()));

        return resultado;
    }
}
