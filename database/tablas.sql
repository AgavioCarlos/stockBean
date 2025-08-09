CREATE TABLE tbl_personas (
	id_persona SERIAL PRIMARY KEY, 
	nombre VARCHAR(100) NOT NULL, 
	apellido_paterno VARCHAR(100) NOT NULL, 
	apellido_materno VARCHAR(100),
	email VARCHAR(255) UNIQUE, 
	status BOOLEAN DEFAULT TRUE, 
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_baja TIMESTAMP,
	fecha_ultima_modificacion TIMESTAMP
);

CREATE TABLE cat_roles (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion VARCHAR(255),
    fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_baja TIMESTAMP,
    fecha_ultima_modificacion TIMESTAMP
);

CREATE INDEX idx_cat_roles_nombre ON cat_roles(nombre);

CREATE TABLE tbl_usuarios (
    id_usuario SERIAL PRIMARY KEY,
    id_persona INT NOT NULL,
    cuenta VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_baja TIMESTAMP,
    fecha_ultima_modificacion TIMESTAMP,
    
    CONSTRAINT fk_usuario_persona FOREIGN KEY (id_persona) REFERENCES tbl_personas(id_persona),
    CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol) REFERENCES cat_roles(id_rol)
);

CREATE INDEX idx_tbl_usuarios_status ON tbl_usuarios(status);
CREATE INDEX idx_tbl_usuarios_id_persona ON tbl_usuarios(id_persona);

CREATE TABLE cat_unidades (
	id_unidad SERIAL PRIMARY KEY, 
	nombre VARCHAR(100) NOT NULL, 
	abreviatura VARCHAR(10), 
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_baja TIMESTAMP,
	fecha_ultima_modificacion TIMESTAMP
);

CREATE INDEX idx_cat_unidades_nombre ON cat_unidades(nombre);

CREATE TABLE cat_categorias (
	id_categoria SERIAL PRIMARY KEY, 
	nombre VARCHAR(100) NOT NULL,
	status BOOLEAN DEFAULT TRUE,
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_baja TIMESTAMP,
	fecha_ultima_modificacion TIMESTAMP
);

CREATE INDEX idx_cat_categorias_nombre ON cat_categorias(nombre);
CREATE INDEX idx_cat_categorias_status ON cat_categorias(status);

CREATE TABLE cat_marcas (
	id_marca SERIAL PRIMARY KEY, 
	nombre VARCHAR(100) NOT NULL,
	status BOOLEAN DEFAULT TRUE,
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_baja TIMESTAMP,
	fecha_ultima_modificacion TIMESTAMP
);

CREATE INDEX idx_cat_marcas_nombre ON cat_marcas(nombre);
CREATE INDEX idx_cat_marcas_status ON cat_marcas(status);
------------------------------------------------------------

CREATE TABLE tbl_productos (
	id_producto SERIAL PRIMARY KEY,
	nombre VARCHAR(150) NOT NULL,
	descripcion TEXT,
	id_categoria INT NOT NULL,
	id_unidad INT NOT NULL,
	id_marca INT,
	codigo_barras VARCHAR(50) UNIQUE, 
	imagen_url VARCHAR(255),
	status BOOLEAN DEFAULT TRUE,
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_baja TIMESTAMP,
	fecha_ultima_modificacion TIMESTAMP,

	CONSTRAINT fk_producto_categoria FOREIGN KEY (id_categoria) REFERENCES cat_categorias(id_categoria),
	CONSTRAINT fk_producto_unida FOREIGN KEY (id_unidad) REFERENCES cat_unidades(id_unidad),
	CONSTRAINT fk_producto_marca FOREIGN KEY (id_marca) REFERENCES cat_marcas(id_marca)
);


CREATE INDEX idx_tbl_productos_id_categoria ON tbl_productos(id_categoria);
CREATE INDEX idx_tbl_productos_id_unidad ON tbl_productos(id_unidad);
CREATE INDEX idx_tbl_productos_status ON tbl_productos(status);
CREATE INDEX idx_tbl_productos_nombre ON tbl_productos(nombre);


CREATE TABLE tbl_proveedores (
	id_proveedor SERIAL PRIMARY KEY,
	nombre VARCHAR(150) NOT NULL,
	direccion VARCHAR(255),
	telefono VARCHAR(50), 
	email VARCHAR(100), 
	status BOOLEAN DEFAULT TRUE, 
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
	fecha_baja TIMESTAMP, 
	fecha_ultima_modificacion TIMESTAMP
);

CREATE INDEX idx_tbl_proveedores_status ON tbl_proveedores(status);
CREATE INDEX idx_tbl_proveedores_nombre ON tbl_proveedores(nombre); 
CREATE INDEX idx_tbl_proveedores_email ON tbl_proveedores(email);

CREATE TABLE tbl_productos_proveedor (
	id_producto_proveedor SERIAL PRIMARY KEY, 
	id_producto INT NOT NULL, 
	id_proveedor INT NOT NULL,
	precio DECIMAL(10,2) NOT NULL,
	codigo_proveedor VARCHAR(100),
	tiempo_entrega INT,
	status BOOLEAN DEFAULT TRUE, 
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
	fecha_baja TIMESTAMP,
	fecha_ultima_modificacion TIMESTAMP,

	CONSTRAINT fk_producto_proveedor_producto FOREIGN KEY (id_producto) REFERENCES tbl_productos(id_producto),
	CONSTRAINT fk_producto_proveedor_proveedor FOREIGN KEY (id_proveedor) REFERENCES tbl_proveedores(id_proveedor)
);

CREATE INDEX idx_tbl_productos_proveedor_id_producto ON tbl_productos_proveedor(id_producto);
CREATE INDEX idx_tbl_productos_proveedor_id_proveedor ON tbl_productos_proveedor(id_proveedor);
CREATE INDEX idx_tbl_productos_proveedor_status ON tbl_productos_proveedor(status);

CREATE TABLE tbl_cliente (
	id_cliente SERIAL PRIMARY KEY, 
	id_persona INT NOT NULL, 
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
	fecha_baja TIMESTAMP,
	fecha_ultima_modificacion TIMESTAMP,
	status BOOLEAN DEFAULT TRUE,
	tipo_cliente VARCHAR(50),

	CONSTRAINT fk_cliente_persona FOREIGN KEY (id_persona) REFERENCES tbl_personas(id_persona)
);

CREATE INDEX idx_tbl_clientes_id_persona ON tbl_cliente(id_persona);
CREATE INDEX idx_tbl_clientes_status ON tbl_cliente(status);

ALTER TABLE tbl_cliente RENAME TO tbl_clientes;

CREATE TABLE tbl_sucursales (
	id_sucursal SERIAL PRIMARY KEY, 
	nombre VARCHAR(100) NOT NULL, 
	direccion VARCHAR(255),
	telefono VARCHAR(50),
	email VARCHAR(100),
	status BOOLEAN DEFAULT TRUE,
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
	fecha_baja TIMESTAMP, 
	fecha_ultima_modificacion TIMESTAMP
);

CREATE INDEX idx_tbl_sucursales_nombre ON tbl_sucursales(nombre); 
CREATE INDEX idx_tbl_sucursales_status ON tbl_sucursales(status);
CREATE INDEX idx_tbl_sucursales_email ON tbl_sucursales(email);

-----------------------------------------------------------------

CREATE TABLE tbl_lotes_inventario (
	id_lote_inventario SERIAL PRIMARY KEY,
	id_producto INT NOT NULL,
	id_sucursal INT NOT NULL,
	cantidad INT NOT NULL,
	lote VARCHAR(100),
	fecha_caducidad TIMESTAMP,
	fecha_entrada TIMESTAMP,
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_baja TIMESTAMP,
	fecha_ultima_modificacion TIMESTAMP, 

	CONSTRAINT fk_lote_producto FOREIGN KEY (id_producto) REFERENCES tbl_productos(id_producto),
	CONSTRAINT fk_lote_sucursal FOREIGN KEY (id_sucursal) REFERENCES tbl_sucursales(id_sucursal)
);
CREATE INDEX idx_tbl_lotes_id_producto ON tbl_lotes_inventario(id_producto);
CREATE INDEX idx_tbl_lotes_id_sucursal ON tbl_lotes_inventario(id_sucursal);
CREATE INDEX idx_tbl_lotes_lote ON tbl_lotes_inventario(lote);

CREATE TABLE tbl_inventario (
	id_inventario SERIAL PRIMARY KEY,
	id_producto INT NOT NULL,
	id_sucursal INT NOT NULL,
	stock_actual INT NOT NULL,
	stock_minimo INT NOT NULL,
	status BOOLEAN DEFAULT TRUE,
	id_lote_inventario INT,
	fecha_caducidad TIMESTAMP,
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_baja TIMESTAMP,
	fecha_ultima_modificacion TIMESTAMP,

	CONSTRAINT fk_inventario_producto FOREIGN KEY (id_producto) REFERENCES tbl_productos(id_producto),
	CONSTRAINT fk_inventario_sucursal FOREIGN KEY (id_sucursal) REFERENCES tbl_sucursales(id_sucursal),
	CONSTRAINT fk_inventario_lote FOREIGN KEY (id_lote_inventario) REFERENCES tbl_lotes_inventario(id_lote_inventario)
);

CREATE INDEX idx_tbl_inventario_id_producto ON tbl_inventario(id_producto);
CREATE INDEX idx_tbl_inventario_id_sucursal ON tbl_inventario(id_sucursal);
CREATE INDEX idx_tbl_inventario_status ON tbl_inventario(status);


CREATE TABLE tbl_usuario_sucursales (
	id_usuario_sucursal SERIAL primary KEY,
	id_usuario INT NOT NULL,
	id_sucursal INT NOT NULL, 
	status BOOLEAN DEFAULT TRUE,
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_baja TIMESTAMP,
	fecha_ultima_modificacion TIMESTAMP,

	CONSTRAINT fk_usuario_sucursal_usuario FOREIGN KEY (id_usuario) REFERENCES tbl_usuarios(id_usuario),
	CONSTRAINT fk_usuario_sucursal_sucursal FOREIGN KEY (id_sucursal) REFERENCES tbl_sucursales(id_sucursal),
	CONSTRAINT uq_usuario_sucursal UNIQUE (id_usuario, id_sucursal)
);

CREATE INDEX idx_tbl_usuario_sucursales_status ON tbl_usuario_sucursales(status);
CREATE INDEX idx_tbl_usuario_sucursales_id_usuario ON tbl_usuario_sucursales(id_usuario);
CREATE INDEX idx_tbl_usuario_sucurales_id_sucursal ON tbl_usuario_sucursales(id_sucursal);

---------------------------------------------------------

CREATE TABLE tbl_compras (

	id_compra SERIAL PRIMARY KEY,
	id_sucursal INT NOT NULL,
	id_proveedor INT NOT NULL,
	fecha_compra TIMESTAMP NOT NULL,
	total DECIMAL(10,2) NOT NULL,
	observaciones TEXT, 
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
	fecha_baja TIMESTAMP,
	fecha_ultima_modificacion TIMESTAMP,

	CONSTRAINT fk_compra_sucursal FOREIGN KEY (id_sucursal) REFERENCES tbl_sucursales(id_sucursal),
	CONSTRAINT fk_compra_proveedor FOREIGN KEY (id_proveedor) REFERENCES tbl_proveedores(id_proveedor)
);

CREATE INDEX idx_tbl_compras_id_sucursal ON tbl_compras(id_sucursal);
CREATE INDEX idx_tbl_compras_id_proveedor ON tbl_compras(id_proveedor);
CREATE INDEX idx_tbl_compras_fecha_compra ON tbl_compras(fecha_compra);


CREATE TABLE tbl_detalle_compra (
	id_detalle_compra SERIAL PRIMARY KEY,
	id_compra INT NOT NULL,
	id_producto INT NOT NULL,
	id_lote_inventario INT,
	cantidad INT NOT NULL,
	precio_unitario DECIMAL(10,2) NOT NULL,
	subtotal DECIMAL(10,2) NOT NULL,
	lote VARCHAR(100),
	fecha_caducidad TIMESTAMP,
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_baja TIMESTAMP,
	fecha_ultima_modificacion TIMESTAMP,

	CONSTRAINT fk_detalle_compra FOREIGN KEY (id_compra) REFERENCES tbl_compras(id_compra),
	CONSTRAINT fk_detalle_producto FOREIGN KEY (id_producto) REFERENCES tbl_productos(id_producto),
	CONSTRAINT fk_detalle_lote FOREIGN KEY (id_lote_inventario) REFERENCES tbl_lotes_inventario(id_lote_inventario)
);

CREATE INDEX idx_tbl_detalle_compra_id_compra ON tbl_detalle_compra(id_compra);
CREATE INDEX idx_tbl_detalle_compra_id_producto ON tbl_detalle_compra(id_producto);
CREATE INDEX idx_tbl_detalle_compra_id_lote ON tbl_detalle_compra(id_lote_inventario);

CREATE TABLE cat_metodos_pago (
	id_metodo_pago SERIAL PRIMARY KEY,
	nombre VARCHAR(100) NOT NULL, 
	descripcion VARCHAR(255), 
	status BOOLEAN DEFAULT TRUE,
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_baja TIMESTAMP,
	fecha_ultima_modificacion TIMESTAMP
);

CREATE INDEX idx_cat_metodos_pago_nombre ON cat_metodos_pago(nombre);
CREATE INDEX idx_cat_metodos_pago_status ON cat_metodos_pago(status);


CREATE TABLE tbl_ventas (
	id_venta SERIAL PRIMARY KEY,
	id_sucursal INT NOT NULL,
	id_usuario INT NOT NULL,
	fecha_venta TIMESTAMP NOT NULL, 
	total DECIMAL(10,2) NOT NULL,
	id_metodo_pago INT NOT NULL,
	ticket_url VARCHAR(255),
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_baja TIMESTAMP,
	fecha_ultima_modificacion TIMESTAMP,

	CONSTRAINT fk_venta_sucursal FOREIGN KEY (id_sucursal) REFERENCES tbl_sucursales(id_sucursal), 
	CONSTRAINT fk_venta_usuario FOREIGN KEY (id_usuario) REFERENCES tbl_usuarios(id_usuario),
	CONSTRAINT fk_venta_metodo FOREIGN KEY (id_metodo_pago) REFERENCES cat_metodos_pago(id_metodo_pago)
);

CREATE INDEX idx_tbl_ventas_id_sucursal ON tbl_ventas(id_sucursal);
CREATE INDEX idx_tbl_ventas_id_usuario ON tbl_ventas(id_usuario);
CREATE INDEX idx_tbl_ventas_fecha_venta ON tbl_ventas(fecha_venta);


CREATE TABLE tbl_detalle_venta (
	id_detalle_venta SERIAL PRIMARY KEY,
	id_venta INT NOT NULL,
	id_producto INT NOT NULL,
	id_lote_inventario INT,
	cantidad DECIMAL(10,2) NOT NULL,
	precio_unitario DECIMAL(10,2) NOT NULL,
	descuento DECIMAL(10,2),
	subtotal DECIMAL(10,2) NOT NULL,
	tipo_venta VARCHAR(50),
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_baja TIMESTAMP,
	fecha_ultima_modificacion TIMESTAMP,
	
	CONSTRAINT fk_detalle_venta_venta FOREIGN KEY (id_venta) REFERENCES tbl_ventas(id_venta),
	CONSTRAINT fk_detalle_venta_producto FOREIGN KEY (id_producto) REFERENCES tbl_productos(id_producto),
	CONSTRAINT fk_detalle_venta_lote FOREIGN KEY (id_lote_inventario) REFERENCES tbl_lotes_inventario(id_lote_inventario)
);

CREATE INDEX idx_tbl_detalle_venta_id_venta ON tbl_detalle_venta(id_venta);
CREATE INDEX idx_tbl_detalle_venta_id_producto ON tbl_detalle_venta(id_producto);
CREATE INDEX idx_tbl_detalle_venta_id_lote ON tbl_detalle_venta(id_lote_inventario);


CREATE TABLE cat_motivos (
	id_motivo SERIAL PRIMARY KEY,
	tipo VARCHAR(50) NOT NULL,
	nombre VARCHAR(100) NOT NULL,
	descripcion VARCHAR(255),
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_baja TIMESTAMP,
	fecha_ultima_modificacion TIMESTAMP
);

CREATE INDEX idx_cat_motivos_tipo ON cat_motivos(tipo);
CREATE INDEX idx_cat_motivos_nombre ON cat_motivos(nombre);

------------------------------------------------------------------

CREATE TABLE tbl_devoluciones_compra (
	id_devolucion SERIAL PRIMARY KEY, 
	id_compra INT NOT NULL, 
	id_producto INT NOT NULL, 
	cantidad INT NOT NULL,
	fecha TIMESTAMP NOT NULL,
	id_motivo INT NOT NULL,
	id_usuario INT NOT NULL, 
	id_sucursal INT NOT NULL,
	status BOOLEAN DEFAULT TRUE,
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_baja TIMESTAMP,
	fecha_ultima_modificacion TIMESTAMP, 

	CONSTRAINT fk_dev_compra_compra FOREIGN KEY (id_compra) REFERENCES tbl_compras(id_compra),
	CONSTRAINT fk_dev_compra_producto FOREIGN KEY (id_producto) REFERENCES tbl_productos(id_producto),
	CONSTRAINT fk_dev_compra_usuario FOREIGN KEY (id_usuario) REFERENCES tbl_usuarios(id_usuario),
	CONSTRAINT fk_dev_compra_sucursal FOREIGN KEY (id_sucursal) REFERENCES tbl_sucursales(id_sucursal),
	CONSTRAINT fk_dev_compra_motivo FOREIGN KEY (id_motivo) REFERENCES cat_motivos(id_motivo)
);

CREATE INDEX idx_tbl_devoluciones_compra_id_compra ON tbl_devoluciones_compra(id_compra);
CREATE INDEX idx_tbl_devoluciones_compra_id_producto ON tbl_devoluciones_compra(id_producto);
CREATE INDEX idx_tbl_devoluciones_compra_id_usuario ON tbl_devoluciones_compra(id_usuario);
CREATE INDEX idx_tbl_devoluciones_compra_motivo ON tbl_devoluciones_compra(id_motivo);
CREATE INDEX idx_tbl_devoluciones_compra_sucursal ON tbl_devoluciones_compra(id_sucursal);
CREATE INDEX idx_tbl_devoluciones_compra_status ON tbl_devoluciones_compra(status);


CREATE TABLE tbl_devoluciones_venta(
	id_devolucion SERIAL PRIMARY KEY,
	id_venta INT NOT NULL,
	id_producto INT NOT NULL,
	cantidad INT NOT NULL,
	fecha TIMESTAMP NOT NULL,
	id_motivo INT NOT NULL,
	id_usuario INT NOT NULL,
	id_sucursal INT NOT NULL,
	status BOOLEAN DEFAULT TRUE,
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_baja TIMESTAMP, 
	fecha_ultima_moficacion TIMESTAMP, 

	CONSTRAINT fk_dev_venta_venta FOREIGN KEY (id_venta) REFERENCES tbl_ventas(id_venta),
	CONSTRAINT fk_dev_venta_producto FOREIGN KEY (id_producto) REFERENCES tbl_productos(id_producto),
	CONSTRAINT fk_dev_venta_usuario FOREIGN KEY (id_usuario) REFERENCES tbl_usuarios(id_usuario),
	CONSTRAINT fk_dev_venta_sucursal FOREIGN KEY (id_sucursal) REFERENCES tbl_sucursales(id_sucursal),
	CONSTRAINT fk_dev_venta_motivo FOREIGN KEY (id_motivo) REFERENCES cat_motivos(id_motivo)
	
);

CREATE INDEX idx_tbl_devoluciones_venta_id_venta ON tbl_devoluciones_venta(id_venta);
CREATE INDEX idx_tbl_devoluciones_venta_id_producto ON tbl_devoluciones_venta(id_producto);
CREATE INDEX idx_tbl_devoluciones_venta_id_usuario ON tbl_devoluciones_venta(id_usuario);
CREATE INDEX idx_tbl_devoluciones_venta_id_motivo ON tbl_devoluciones_venta(id_motivo);
CREATE INDEX idx_tbl_devoluciones_venta_id_sucursal ON tbl_devoluciones_venta(id_sucursal);
CREATE INDEX idx_tbl_devoluciones_venta_status ON tbl_devoluciones_venta(status);


CREATE TABLE tbl_cancelacion_compra (
	id_cancelacion SERIAL PRIMARY KEY,
	id_compra INT NOT NULL,
	fecha TIMESTAMP NOT NULL,
	id_motivo INT NOT NULL,
	id_usuario INT NOT NULL,
	id_sucursal INT NOT NULL,
	status BOOLEAN DEFAULT TRUE,
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_baja TIMESTAMP,
	fecha_ultima_modificacion TIMESTAMP,

	CONSTRAINT fk_cancel_compra_compra FOREIGN KEY (id_compra) REFERENCES tbl_compras(id_compra), 
	CONSTRAINT fk_cancel_compra_motivo FOREIGN KEY (id_motivo) REFERENCES cat_motivos(id_motivo),
	CONSTRAINT fk_cancel_compra_usuario FOREIGN KEY (id_usuario) REFERENCES tbl_usuarios(id_usuario),
	CONSTRAINT fk_cancel_compra_sucursal FOREIGN KEY (id_sucursal) REFERENCES tbl_sucursales(id_sucursal)	
);

CREATE INDEX idx_tbl_cancelacion_compra_id_compra ON tbl_cancelacion_compra(id_compra);
CREATE INDEX idx_tbl_cancelacion_compra_id_motivo ON tbl_cancelacion_compra(id_motivo);
CREATE INDEX idx_tbl_cancelacion_compra_id_usuario ON tbl_cancelacion_compra(id_usuario);
CREATE INDEX idx_tbl_cancelacion_compra_id_sucursal ON tbl_cancelacion_compra(id_sucursal);
CREATE INDEX idx_tbl_cancelacion_compra_status ON tbl_cancelacion_compra(status);


CREATE TABLE tbl_cancelaciones_venta (
	id_cancelacion SERIAL PRIMARY KEY, 
	id_venta INT NOT NULL, 
	fecha TIMESTAMP NOT NULL,
	id_motivo INT NOT NULL,
	id_usuario INT NOT NULL,
	id_sucursal INT NOT NULL,
	status BOOLEAN DEFAULT TRUE, 
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_baja TIMESTAMP,
	fecha_ultima_modificacion TIMESTAMP, 

	CONSTRAINT fk_cancel_venta_venta FOREIGN KEY (id_venta) REFERENCES tbl_ventas(id_venta), 
	CONSTRAINT fk_cancel_venta_motivo FOREIGN KEY (id_motivo) REFERENCES cat_motivos(id_motivo),
	CONSTRAINT fk_cancel_venta_usuario FOREIGN KEY (id_usuario) REFERENCES tbl_usuarios(id_usuario),
	CONSTRAINT fk_cancel_venta_sucursal FOREIGN KEY (id_sucursal) REFERENCES tbl_sucursales(id_sucursal)
);

CREATE INDEX idx_tbl_cancelaciones_venta_id_venta ON tbl_cancelaciones_venta(id_venta);
CREATE INDEX idx_tbl_cancelaciones_venta_id_motivo ON tbl_cancelaciones_venta(id_motivo);
CREATE INDEX idx_tbl_cancelaciones_venta_usuario ON tbl_cancelaciones_venta(id_usuario);
CREATE INDEX idx_tbl_cancelaciones_venta_sucursal ON tbl_cancelaciones_venta(id_sucursal);
CREATE INDEX idx_tbl_cancelaciones_venta_status ON tbl_cancelaciones_venta(status);

CREATE TABLE cat_categorias_gasto (
	id_categoria_gasto SERIAL PRIMARY KEY,
	nombre VARCHAR(100) NOT NULL, 
	descripcion VARCHAR(255), 
	deducible BOOLEAN DEFAULT FALSE, 
	status BOOLEAN DEFAULT TRUE,
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
	fecha_baja TIMESTAMP,
	fecha_ultima_modificacion TIMESTAMP
);

CREATE INDEX idx_cat_categorias_gasto_nombre ON cat_categorias_gasto(nombre);
CREATE INDEX idx_cat_categorias_gasto_status ON cat_categorias_gasto(status);


CREATE TABLE tbl_gastos (
	id_gasto SERIAL PRIMARY KEY,
	id_sucursal INT NOT NULL,
	fecha TIMESTAMP NOT NULL,
	descripcion VARCHAR(255), 
	monto DECIMAL(10,2) NOT NULL,
	id_categoria_gasto INT NOT NULL,
	observacion TEXT,
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
	fecha_baja TIMESTAMP,
	fecha_ultima_modificacion TIMESTAMP,

	CONSTRAINT  fk_gasto_sucursal FOREIGN KEY (id_sucursal) REFERENCES tbl_sucursales(id_sucursal),
	CONSTRAINT  fk_gasto_categoria FOREIGN KEY (id_categoria_gasto) REFERENCES cat_categorias_gasto(id_categoria_gasto)
);

CREATE INDEX idx_tbl_gastos_id_sucursal ON tbl_gastos(id_sucursal);
CREATE INDEX idx_tbl_gastos_fecha ON tbl_gastos(fecha);


CREATE TABLE tbl_movimientos_inventario (
	id_movimiento_inventario SERIAL PRIMARY KEY,
	id_producto INT NOT NULL,
	id_sucursal INT NOT NULL,
	tipo VARCHAR(50) NOT NULL,
	fecha TIMESTAMP NOT NULL,
	cantidad DECIMAL(10,2) NOT NULL,
	id_motivo INT,
	documento_url VARCHAR(255), 
	id_usuario INT NOT NULL, 
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
	fecha_baja TIMESTAMP, 
	fecha_ultima_modificacion TIMESTAMP,

	CONSTRAINT fk_mov_inv_producto FOREIGN KEY (id_producto) REFERENCES tbl_productos(id_producto),
	CONSTRAINT fk_mov_inv_sucursal FOREIGN KEY (id_sucursal) REFERENCES tbl_sucursales(id_sucursal),
	CONSTRAINT fk_mov_inv_motivo FOREIGN KEY (id_motivo) REFERENCES cat_motivos(id_motivo),
	CONSTRAINT fk_mov_inv_usuario FOREIGN KEY (id_usuario) REFERENCES tbl_usuarios(id_usuario)
);

CREATE INDEX idx_tbl_movimientos_inventario_id_producto ON tbl_movimientos_inventario(id_producto);
CREATE INDEX idx_tbl_movimientos_inventario_id_sucursal ON tbl_movimientos_inventario(id_sucursal);
CREATE INDEX idx_tbl_movimientos_inventario_id_motivo ON tbl_movimientos_inventario(id_motivo);
CREATE INDEX idx_tbl_movimientos_inventario_id_usuario ON tbl_movimientos_inventario(id_usuario);
CREATE INDEX idx_tbl_movimientos_inventario_fecha ON tbl_movimientos_inventario(fecha);
CREATE INDEX idx_tbl_movimientos_inventario_tipo ON tbl_movimientos_inventario(tipo);


CREATE TABLE cat_tipos_promocion (
	id_tipo_promocion SERIAL PRIMARY KEY,
	nombre VARCHAR(100) NOT NULL,
	descripcion VARCHAR(255),
	status BOOLEAN DEFAULT TRUE,
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
	fecha_baja TIMESTAMP
);

CREATE TABLE tbl_promociones (
	id_promocion SERIAL PRIMARY KEY,
	id_sucursal INT NOT NULL,
	nombre VARCHAR(100) NOT NULL,
	descripcion VARCHAR(255), 
	id_tipo_promocion INT NOT NULL,
	fecha_inicio TIMESTAMP NOT NULL,
	fecha_fin TIMESTAMP NOT NULL,
	porcentaje_descuento DECIMAL(5,2),
	status BOOLEAN DEFAULT TRUE,
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
	fecha_baja TIMESTAMP, 
	fecha_ultima_modificacion TIMESTAMP,

	CONSTRAINT fk_promocion_sucursal FOREIGN KEY (id_sucursal) REFERENCES tbl_sucursales(id_sucursal), 
	CONSTRAINT fk_promocion_tipo FOREIGN KEY (id_tipo_promocion) REFERENCES cat_tipos_promocion(id_tipo_promocion)
);

CREATE INDEX idx_tbl_promociones_id_sucursal ON tbl_promociones(id_sucursal);
CREATE INDEX idx_tbl_promociones_nombre ON tbl_promociones(nombre);
CREATE INDEX idx_tbl_promociones_status ON tbl_promociones(status);
CREATE INDEX idx_tbl_promociones_fecha_inicio ON tbl_promociones(fecha_inicio);
CREATE INDEX idx_tbl_promociones_fecha_fin ON tbl_promociones(fecha_fin);


CREATE TABLE tbl_promociones_productos (
	id_promocion_producto SERIAL PRIMARY KEY, 
	id_promocion INT NOT NULL,
	id_producto INT NOT NULL,
	cantidad_minima INT,
	cantidad_promo INT, 
	precio_promo DECIMAL(10,2), 
	status BOOLEAN DEFAULT TRUE,
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_baja TIMESTAMP,
	fecha_ultima_modificacion TIMESTAMP, 

	CONSTRAINT fk_promocion_producto_promocion FOREIGN KEY (id_promocion) REFERENCES tbl_promociones(id_promocion),
	CONSTRAINT fk_promocion_producto_producto FOREIGN KEY (id_producto) REFERENCES tbl_productos(id_producto)
);

CREATE INDEX idx_tbl_promociones_productos_id_promocion ON tbl_promociones_productos(id_promocion);
CREATE INDEX idx_tbl_promociones_productos_id_producto ON tbl_promociones_productos(id_producto);
CREATE INDEX idx_tbl_promociones_productos_status ON tbl_promociones_productos(status);

CREATE TABLE cat_tipos_alerta (
	id_tipo_alerta SERIAL PRIMARY KEY,
	nombre VARCHAR(100) NOT NULL, 
	descripcion VARCHAR(255),
	status BOOLEAN DEFAULT TRUE,
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
	fecha_baja TIMESTAMP
);

CREATE TABLE tbl_alertas ( 
	id_alerta SERIAL PRIMARY KEY,
	id_producto INT NOT NULL,
	id_sucursal INT NOT NULL,
	id_tipo_alerta INT NOT NULL,
	fecha TIMESTAMP NOT NULL,
	mensaje TEXT, 
	status BOOLEAN DEFAULT TRUE, 
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_ultima_modificacion TIMESTAMP,

	CONSTRAINT fk_alerta_producto FOREIGN KEY (id_producto) REFERENCES tbl_productos(id_producto), 
	CONSTRAINT fk_alerta_sucursal FOREIGN KEY (id_sucursal) REFERENCES tbl_sucursales(id_sucursal),
	CONSTRAINT fk_alerta_tipo FOREIGN KEY (id_tipo_alerta) REFERENCES cat_tipos_alerta(id_tipo_alerta)
);

CREATE INDEX idx_tbl_alertas_id_producto ON tbl_alertas(id_producto);
CREATE INDEX idx_tbl_alertas_id_sucursal ON tbl_alertas(id_sucursal); 
CREATE INDEX idx_tbl_alertas_id_tipo_alerta ON tbl_alertas(id_tipo_alerta);
CREATE INDEX idx_tbl_alertas_id_status ON tbl_alertas(status);
CREATE INDEX idx_tbl_alertas_fecha ON tbl_alertas(fecha);


CREATE TABLE cat_planes (
	id_plan SERIAL PRIMARY KEY,
	nombre VARCHAR(100) NOT NULL,
	descripcion VARCHAR(255), 
	precio_mensual DECIMAL(10,2),
	precio_anual DECIMAL(10,2),
	caracteristicas TEXT,
	status BOOLEAN DEFAULT TRUE,
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_baja TIMESTAMP,
	fecha_ultima_modificacion TIMESTAMP
);

CREATE INDEX idx_cat_planes_nombre ON cat_planes(nombre);
CREATE INDEX idx_cat_plabes_status ON cat_planes(status);

CREATE TABLE tbl_suscripciones (
	id_suscripciones INT NOT NULL,
	id_usuario INT NOT NULL,
	id_plan INT NOT NULL,
	fecha_inicio TIMESTAMP NOT NULL,
	fecha_fin TIMESTAMP NOT NULL,
	status BOOLEAN DEFAULT TRUE,
	id_metodo_pago INT NOT NULL,
	referencia_pago VARCHAR(100),
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_baja TIMESTAMP,
	fecha_ultima_modificacion TIMESTAMP,

	CONSTRAINT fk_suscripcion_usuario FOREIGN KEY (id_usuario) REFERENCES tbl_usuarios(id_usuario), 
	CONSTRAINT fk_suscripcion_plan FOREIGN KEY (id_plan) REFERENCES cat_planes(id_plan),
	CONSTRAINT fk_suscripcion_metodo FOREIGN KEY (id_metodo_pago) REFERENCES cat_metodos_pago(id_metodo_pago)
);

CREATE INDEX idx_tbl_suscripciones_id_usuario ON tbl_suscripciones(id_usuario);
CREATE INDEX idx_tbl_suscripciones_id_plan ON tbl_suscripciones(id_plan);
CREATE INDEX idx_tbl_suscripciones_status ON tbl_suscripciones(status);


CREATE TABLE cat_permisos ( 
	id_permiso SERIAL PRIMARY KEY,
	nombre VARCHAR(100) NOT NULL,
	descripcion VARCHAR(255), 
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_baja TIMESTAMP, 
	fecha_ultima_modificacion TIMESTAMP
);

CREATE INDEX idx_cat_permisos_nombre ON cat_permisos(nombre);


CREATE TABLE tbl_planes_permisos (
	id_plan_permiso SERIAL PRIMARY KEY,
	id_plan INT NOT NULL, 
	id_permiso INT NOT NULL,
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
	fecha_baja TIMESTAMP, 
	fecha_ultima_modificacion TIMESTAMP,

	CONSTRAINT fk_plan_permiso_plan FOREIGN KEY (id_plan) REFERENCES cat_planes(id_plan),
	CONSTRAINT fk_plan_permiso_permiso FOREIGN KEY (id_permiso) REFERENCES cat_permisos(id_permiso)
);

CREATE INDEX idx_tbl_planes_permisos_id_plan ON tbl_planes_permisos(id_plan);
CREATE INDEX idx_tbl_planes_permisos_id_permiso ON tbl_planes_permisos(id_permiso);


CREATE TABLE tbl_rol_permiso (
	id_rol_permiso SERIAL PRIMARY KEY,
	id_rol INT NOT NULL,
	id_permiso INT NOT NULL,
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_baja TIMESTAMP, 
	fecha_ultima_modificacion TIMESTAMP, 

	CONSTRAINT fk_rol_permiso_rol FOREIGN KEY (id_rol) REFERENCES cat_roles(id_rol),
	CONSTRAINT fk_rol_permiso_permiso FOREIGN KEY (id_permiso) REFERENCES cat_permisos(id_permiso)
); 

CREATE INDEX idx_tbl_rol_permiso_id_rol ON tbl_rol_permiso(id_rol);
CREATE INDEX idx_tbl_rol_permiso_id_permiso ON tbl_rol_permiso(id_permiso);


CREATE TABLE tbl_configuracion_sistema (
	id_config SERIAL PRIMARY KEY,
	id_sucursal INT NOT NULL, 
	parametro VARCHAR(100) NOT NULL,
	valor VARCHAR(255),
	descripcion VARCHAR(255),
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_baja TIMESTAMP, 
	fecha_ultima_modificacion TIMESTAMP,

	CONSTRAINT fk_config_sucursal FOREIGN KEY (id_sucursal) REFERENCES tbl_sucursales(id_sucursal)
); 

CREATE INDEX idx_tbl_configuracion_sistema_id_sucursal ON tbl_configuracion_sistema(id_sucursal);
CREATE INDEX idx_tbl_configuracion_sistema_parametro ON tbl_configuracion_sistema(parametro);


CREATE TABLE tbl_bitacora (
	id_bitacora SERIAL PRIMARY KEY,
	id_usuario INT NOT NULL,
	modulo VARCHAR(100),
	accion VARCHAR(100), 
	descripcion TEXT,
	fecha TIMESTAMP NOT NULL,
	ip VARCHAR(50),
	datos_anteriores TEXT,
	datos_nuevos TEXT, 
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
	fecha_baja TIMESTAMP,
	fecha_ultima_modificacion TIMESTAMP,

	CONSTRAINT fk_bitacora_usuario FOREIGN KEY (id_usuario) REFERENCES tbl_usuarios(id_usuario)
);

CREATE INDEX idx_tbl_bitacora_id_usuario ON tbl_bitacora(id_usuario);
CREATE INDEX idx_tbl_bitacora_fecha ON tbl_bitacora(fecha);
CREATE INDEX idx_tbl_bitacora_modulo ON tbl_bitacora(modulo);


CREATE TABLE cat_tipo_precio (
	id_tipo_precio SERIAL PRIMARY KEY,
	nombre VARCHAR(100) NOT NULL,
	descripcion VARCHAR(255),
	status BOOLEAN DEFAULT TRUE
);


CREATE TABLE tbl_historial_precios (
	id_historial SERIAL PRIMARY KEY,
	id_producto INT NOT NULL,
	precio_anterior DECIMAL(10,2) NOT NULL,
	precio_nuevo DECIMAL(10,2) NOT NULL,
	id_tipo_precio INT NOT NULL,
	fecha_cambio TIMESTAMP NOT NULL,
	id_usuario INT NOT NULL,
	motivo VARCHAR(255),
	fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fecha_baja TIMESTAMP,
	fecha_ultima_modificacion TIMESTAMP,

	CONSTRAINT fk_hist_precio_producto FOREIGN KEY (id_producto) REFERENCES tbl_productos(id_producto),
	CONSTRAINT fk_hist_precio_tipo FOREIGN KEY (id_tipo_precio) REFERENCES cat_tipo_precio(id_tipo_precio),
	CONSTRAINT fk_hist_precio_usuario FOREIGN KEY (id_usuario) REFERENCES tbl_usuarios(id_usuario)
);

CREATE INDEX idx_tbl_historial_precios_id_producto ON tbl_historial_precios(id_producto);
CREATE INDEX idx_tbl_historial_precios_id_usuario ON tbl_historial_precios(id_usuario);
CREATE INDEX idx_tbl_historial_precio_fecha_cambio ON tbl_historial_precios(fecha_cambio);
