package com.stockbean.stockapp.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stockbean.stockapp.dto.DetalleVentaItem;
import com.stockbean.stockapp.dto.ProductoBusquedaDTO;
import com.stockbean.stockapp.dto.VentaRequest;
import com.stockbean.stockapp.model.catalogos.MetodoPago;
import com.stockbean.stockapp.model.tablas.DetalleVenta;
import com.stockbean.stockapp.model.tablas.HistorialPrecios;
import com.stockbean.stockapp.model.tablas.Inventario;
import com.stockbean.stockapp.model.tablas.Producto;
import com.stockbean.stockapp.model.tablas.Sucursal;
import com.stockbean.stockapp.model.tablas.Usuario;
import com.stockbean.stockapp.model.tablas.Venta;
import com.stockbean.stockapp.repository.DetalleVentaRepository;
import com.stockbean.stockapp.repository.EmpresaUsuarioRepository;
import com.stockbean.stockapp.repository.HistorialPreciosRepository;
import com.stockbean.stockapp.repository.InventarioRepository;
import com.stockbean.stockapp.repository.MetodoPagoRepository;
import com.stockbean.stockapp.repository.ProductoRepository;
import com.stockbean.stockapp.repository.SucursalRepository;
import com.stockbean.stockapp.repository.UsuarioRepository;
import com.stockbean.stockapp.repository.UsuarioSucursalRepository;
import com.stockbean.stockapp.repository.VentaRepository;
import com.stockbean.stockapp.repository.TurnoCajaRepository;
import com.stockbean.stockapp.model.tablas.TurnoCaja;

import lombok.NonNull;

@Service
public class VentaService {

    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private TurnoCajaRepository turnoCajaRepository;

    @Autowired
    private DetalleVentaRepository detalleVentaRepository;

    @Autowired
    private InventarioRepository inventarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private MetodoPagoRepository metodoPagoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private HistorialPreciosRepository historialPreciosRepository;

    @Autowired
    private SucursalRepository sucursalRepository;

    @Autowired
    private UsuarioSucursalRepository usuarioSucursalRepository;

    @Autowired
    private EmpresaUsuarioRepository empresaUsuarioRepository;

    // ─────────────────────────────────────────────────────────────
    // BUSCAR PRODUCTOS PARA EL PUNTO DE VENTA
    // ─────────────────────────────────────────────────────────────

    /**
     * Busca productos por código de barras o por nombre en una sucursal.
     * Devuelve la info del producto, su precio de venta actual y stock disponible.
     */
    public List<ProductoBusquedaDTO> buscarProductos(
            @NonNull Integer idSucursal,
            String codigoBarras,
            String nombre,
            @NonNull Integer idUsuario) {

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + idUsuario));
        validarAccesoSucursal(usuario, idSucursal);

        List<Inventario> inventarios;

        if (codigoBarras != null && !codigoBarras.trim().isEmpty()) {
            // Búsqueda exacta por código de barras
            inventarios = inventarioRepository.findByCodigoBarrasAndSucursal(codigoBarras.trim(), idSucursal);
        } else if (nombre != null && !nombre.trim().isEmpty()) {
            // Búsqueda parcial por nombre
            inventarios = inventarioRepository.findByNombreProductoAndSucursal(nombre.trim(), idSucursal);
        } else {
            throw new RuntimeException("Debes proporcionar un código de barras o nombre para buscar.");
        }

        // Obtener precios actuales de la sucursal
        List<HistorialPrecios> precios = historialPreciosRepository.findCurrentPricesByBranch(idSucursal);
        Map<Integer, BigDecimal> precioMap = precios.stream()
                .collect(Collectors.toMap(
                        hp -> hp.getProducto().getId_producto(),
                        HistorialPrecios::getPrecioNuevo,
                        (existente, nuevo) -> nuevo));

        List<ProductoBusquedaDTO> resultados = new ArrayList<>();

        for (Inventario inv : inventarios) {
            Producto prod = inv.getProducto();
            ProductoBusquedaDTO dto = new ProductoBusquedaDTO();
            dto.setIdProducto(prod.getId_producto());
            dto.setNombre(prod.getNombre());
            dto.setDescripcion(prod.getDescripcion());
            dto.setCodigoBarras(prod.getCodigoBarras());
            dto.setImagenUrl(prod.getImagenUrl());
            dto.setStockDisponible(inv.getStock_actual());
            dto.setStockMinimo(inv.getStock_minimo());

            // Unidad, marca, categoría
            if (prod.getUnidad() != null)
                dto.setUnidad(prod.getUnidad().getNombre());
            if (prod.getMarca() != null)
                dto.setMarca(prod.getMarca().getNombre());
            if (prod.getCategoria() != null)
                dto.setCategoria(prod.getCategoria().getNombre());

            // Precio de venta actual
            BigDecimal precio = precioMap.get(prod.getId_producto());
            dto.setPrecioVenta(precio != null ? precio : BigDecimal.ZERO);

            resultados.add(dto);
        }

        return resultados;
    }

    // ─────────────────────────────────────────────────────────────
    // REGISTRAR VENTA COMPLETA (HEADER + DETALLES)
    // ─────────────────────────────────────────────────────────────

    /**
     * Registra una venta completa:
     * 1. Crea el registro en tbl_ventas
     * 2. Inserta cada detalle en tbl_detalle_venta
     * → El trigger de BD ajustará el inventario automáticamente
     * 3. Retorna la venta creada
     */
    @Transactional
    public Venta registrarVenta(@NonNull VentaRequest request, @NonNull Integer idUsuario) {

        // Validaciones básicas
        if (request.getIdSucursal() == null) {
            throw new RuntimeException("La sucursal es requerida.");
        }
        if (request.getIdMetodoPago() == null) {
            throw new RuntimeException("El método de pago es requerido.");
        }
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("La venta debe tener al menos un producto.");
        }

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + idUsuario));

        // Verificar Turno
        TurnoCaja turnoActivo = turnoCajaRepository.findByIdUsuarioAndEstado(idUsuario, "ABIERTO");
        if (turnoActivo == null) {
            throw new RuntimeException("No hay un turno de caja abierto para registrar la venta.");
        }

        validarAccesoSucursal(usuario, request.getIdSucursal());

        MetodoPago metodoPago = metodoPagoRepository.findById(request.getIdMetodoPago())
                .orElseThrow(() -> new RuntimeException(
                        "Método de pago no encontrado con ID: " + request.getIdMetodoPago()));

        // Validar stock ANTES de crear la venta
        for (DetalleVentaItem item : request.getItems()) {
            List<Inventario> invList = inventarioRepository.findByProductoAndSucursal(
                    item.getIdProducto(), request.getIdSucursal());

            if (invList.isEmpty()) {
                Producto prod = productoRepository.findById(item.getIdProducto())
                        .orElseThrow(
                                () -> new RuntimeException("Producto no encontrado con ID: " + item.getIdProducto()));
                throw new RuntimeException(
                        "No existe inventario para el producto \"" + prod.getNombre() + "\" en esta sucursal.");
            }

            Inventario inv = invList.get(0);
            if (inv.getStock_actual() < item.getCantidad()) {
                throw new RuntimeException(
                        "No hay suficiente existencia del producto \"" + inv.getProducto().getNombre()
                                + "\" (stock actual: " + inv.getStock_actual()
                                + ", solicitado: " + item.getCantidad() + "). Verifica inventario.");
            }
        }

        // Calcular total desde los items
        BigDecimal totalCalculado = BigDecimal.ZERO;
        for (DetalleVentaItem item : request.getItems()) {
            BigDecimal subtotal = item.getSubtotal();
            if (subtotal == null) {
                subtotal = item.getPrecioUnitario()
                        .multiply(BigDecimal.valueOf(item.getCantidad()));
                if (item.getDescuento() != null) {
                    subtotal = subtotal.subtract(item.getDescuento());
                }
            }
            totalCalculado = totalCalculado.add(subtotal);
        }

        // 1. Crear la venta (header)
        Venta venta = new Venta();
        venta.setIdSucursal(request.getIdSucursal());
        venta.setIdUsuario(idUsuario);
        venta.setFechaVenta(LocalDateTime.now());
        venta.setTotal(totalCalculado.intValue());
        venta.setMetodoPago(metodoPago);
        venta.setFechaAlta(LocalDateTime.now());
        venta.setIdTurno(turnoActivo.getIdTurno());
        venta.setEstado("COMPLETADA");

        Venta ventaGuardada = ventaRepository.save(venta);

        // 2. Insertar cada detalle
        // Al insertar en tbl_detalle_venta, el trigger de BD:
        // - Descuenta stock_actual en tbl_inventario
        // - Genera alertas si stock <= stock_minimo
        // - Lanza excepción si stock insuficiente
        for (DetalleVentaItem item : request.getItems()) {
            Producto producto = productoRepository.findById(item.getIdProducto())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + item.getIdProducto()));

            BigDecimal subtotal = item.getSubtotal();
            if (subtotal == null) {
                subtotal = item.getPrecioUnitario()
                        .multiply(BigDecimal.valueOf(item.getCantidad()));
                if (item.getDescuento() != null) {
                    subtotal = subtotal.subtract(item.getDescuento());
                }
            }

            DetalleVenta detalle = new DetalleVenta();
            detalle.setVenta(ventaGuardada);
            detalle.setProducto(producto);
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecioUnitario(item.getPrecioUnitario());
            detalle.setDescuento(item.getDescuento());
            detalle.setSubTotal(subtotal);
            detalle.setFechaAlta(LocalDateTime.now());

            detalleVentaRepository.save(detalle);
        }

        return ventaGuardada;
    }

    // ─────────────────────────────────────────────────────────────
    // OBTENER VENTAS DE UNA SUCURSAL
    // ─────────────────────────────────────────────────────────────

    public List<Venta> listarVentasPorSucursal(@NonNull Integer idSucursal, @NonNull Integer idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + idUsuario));
        validarAccesoSucursal(usuario, idSucursal);
        return ventaRepository.findBySucursalId(idSucursal);
    }

    // ─────────────────────────────────────────────────────────────
    // OBTENER DETALLE DE UNA VENTA
    // ─────────────────────────────────────────────────────────────

    public List<DetalleVenta> obtenerDetalleVenta(@NonNull Integer idVenta) {
        return detalleVentaRepository.findByVentaId(idVenta);
    }

    // ─────────────────────────────────────────────────────────────
    // OBTENER MÉTODOS DE PAGO
    // ─────────────────────────────────────────────────────────────

    public List<MetodoPago> listarMetodosPago() {
        return metodoPagoRepository.findAll();
    }

    // ─────────────────────────────────────────────────────────────
    // VALIDACIÓN DE ACCESO A SUCURSAL (reutilizada de InventarioService)
    // ─────────────────────────────────────────────────────────────

    private void validarAccesoSucursal(Usuario usuario, Integer idSucursal) {
        String rol = usuario.getNombre_rol();

        if (rol == null) {
            throw new RuntimeException("El usuario no tiene un rol asignado.");
        }

        // SISTEM: Acceso total
        if ("SISTEM".equalsIgnoreCase(rol)) {
            return;
        }

        Sucursal sucursalTarget = sucursalRepository.findById(idSucursal)
                .orElseThrow(() -> new RuntimeException("Sucursal no encontrada con ID: " + idSucursal));

        // ADMIN: Acceso total a su Empresa
        if ("ADMIN".equalsIgnoreCase(rol)) {
            List<Integer> companyIds = empresaUsuarioRepository.findIdEmpresaByUsuarioId(usuario.getId_usuario());
            if (companyIds.isEmpty()) {
                throw new RuntimeException("El usuario administrador no tiene empresa asignada.");
            }
            Integer idEmpresa = companyIds.get(0);
            List<Sucursal> companySucursales = sucursalRepository.findByEmpresaId(idEmpresa);
            boolean belongs = companySucursales.stream()
                    .anyMatch(s -> s.getId_sucursal().equals(idSucursal));
            if (!belongs) {
                throw new RuntimeException("Acceso denegado: La sucursal no pertenece a su empresa.");
            }
            return;
        }

        // GERENTE / CAJERO: Solo su Sucursal asignada
        if ("GERENTE".equalsIgnoreCase(rol) || "CAJERO".equalsIgnoreCase(rol)) {
            boolean access = usuarioSucursalRepository.existsByUsuarioAndSucursal(usuario, sucursalTarget);
            if (!access) {
                throw new RuntimeException("Acceso denegado: No tiene permisos sobre esta sucursal.");
            }
            return;
        }

        throw new RuntimeException("Rol de usuario no autorizado (" + rol + ")");
    }
}
