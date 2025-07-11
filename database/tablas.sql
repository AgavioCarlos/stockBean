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

