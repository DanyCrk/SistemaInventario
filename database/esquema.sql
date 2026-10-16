PRAGMA foreign_keys = ON;


CREATE TABLE roles (
    id_rol INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
);


CREATE TABLE usuarios (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    id_rol INTEGER NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT 1,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (id_rol)
        REFERENCES roles(id_rol)
);


CREATE TABLE categorias (
    id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    activo BOOLEAN NOT NULL DEFAULT 1
);

CREATE TABLE productos (
    id_producto INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio_compra DECIMAL(12,2) NOT NULL,
    precio_venta DECIMAL(12,2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    stock_minimo INTEGER NOT NULL DEFAULT 0,
    id_categoria INTEGER NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT 1,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_producto_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categorias(id_categoria),

    CONSTRAINT chk_precio_compra
        CHECK (precio_compra >= 0),

    CONSTRAINT chk_precio_venta
        CHECK (precio_venta >= 0),

    CONSTRAINT chk_stock
        CHECK (stock >= 0),

    CONSTRAINT chk_stock_minimo
        CHECK (stock_minimo >= 0)
);


CREATE TABLE proveedores (
    id_proveedor INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(150) NOT NULL,
    nit VARCHAR(30) UNIQUE,
    telefono VARCHAR(30),
    correo VARCHAR(150),
    direccion VARCHAR(255),
    activo BOOLEAN NOT NULL DEFAULT 1,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE tipos_movimiento (
    id_tipo_movimiento INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
);


CREATE TABLE clientes (
    id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(150) NOT NULL,
    documento VARCHAR(30) UNIQUE,
    telefono VARCHAR(30),
    correo VARCHAR(150),
    direccion VARCHAR(255),
    activo BOOLEAN NOT NULL DEFAULT 1,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE metodos_pago (
    id_metodo_pago INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    activo BOOLEAN NOT NULL DEFAULT 1
);


CREATE TABLE ventas (
    id_venta INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_usuario INTEGER NOT NULL,
    id_cliente INTEGER,
    id_metodo_pago INTEGER NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    descuento DECIMAL(12,2) NOT NULL DEFAULT 0,
    total DECIMAL(12,2) NOT NULL,
    observacion VARCHAR(255),

    CONSTRAINT fk_venta_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario),

    CONSTRAINT fk_venta_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES clientes(id_cliente),

    CONSTRAINT fk_venta_metodo_pago
        FOREIGN KEY (id_metodo_pago)
        REFERENCES metodos_pago(id_metodo_pago),

    CONSTRAINT chk_subtotal
        CHECK (subtotal >= 0),

    CONSTRAINT chk_descuento
        CHECK (descuento >= 0),

    CONSTRAINT chk_total
        CHECK (total >= 0)
);


CREATE TABLE detalle_venta (
    id_detalle INTEGER PRIMARY KEY AUTOINCREMENT,
    id_venta INTEGER NOT NULL,
    id_producto INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(12,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,

    CONSTRAINT fk_detalle_venta
        FOREIGN KEY (id_venta)
        REFERENCES ventas(id_venta)
        ON DELETE CASCADE,

    CONSTRAINT fk_detalle_producto
        FOREIGN KEY (id_producto)
        REFERENCES productos(id_producto),

    CONSTRAINT chk_cantidad
        CHECK (cantidad > 0),

    CONSTRAINT chk_precio_unitario
        CHECK (precio_unitario >= 0),

    CONSTRAINT chk_detalle_subtotal
        CHECK (subtotal >= 0)
);


CREATE TABLE movimientos_inventario (
    id_movimiento INTEGER PRIMARY KEY AUTOINCREMENT,
    id_producto INTEGER NOT NULL,
    id_tipo_movimiento INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    id_proveedor INTEGER,
    id_venta INTEGER,
    observacion VARCHAR(255),
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_movimiento_producto
        FOREIGN KEY (id_producto)
        REFERENCES productos(id_producto),

    CONSTRAINT fk_movimiento_tipo
        FOREIGN KEY (id_tipo_movimiento)
        REFERENCES tipos_movimiento(id_tipo_movimiento),

    CONSTRAINT fk_movimiento_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario),

    CONSTRAINT fk_movimiento_proveedor
        FOREIGN KEY (id_proveedor)
        REFERENCES proveedores(id_proveedor),

    CONSTRAINT fk_movimiento_venta
        FOREIGN KEY (id_venta)
        REFERENCES ventas(id_venta),

    CONSTRAINT chk_movimiento_cantidad
        CHECK (cantidad > 0)
);


INSERT INTO roles (nombre, descripcion)
VALUES
    ('Administrador', 'Acceso completo al sistema'),
    ('Empleado', 'Acceso a operaciones de inventario y ventas');

INSERT INTO tipos_movimiento (nombre, descripcion)
VALUES
    ('ENTRADA', 'Entrada de productos al inventario'),
    ('SALIDA', 'Salida de productos del inventario'),
    ('AJUSTE_POSITIVO', 'Aumento manual del inventario'),
    ('AJUSTE_NEGATIVO', 'Disminución manual del inventario');

INSERT INTO metodos_pago (nombre)
VALUES
    ('Efectivo'),
    ('Tarjeta'),
    ('Transferencia');


CREATE INDEX idx_productos_nombre
ON productos(nombre);

CREATE INDEX idx_productos_categoria
ON productos(id_categoria);

CREATE INDEX idx_movimientos_producto
ON movimientos_inventario(id_producto);

CREATE INDEX idx_movimientos_fecha
ON movimientos_inventario(fecha);

CREATE INDEX idx_ventas_fecha
ON ventas(fecha);

CREATE INDEX idx_ventas_cliente
ON ventas(id_cliente);

CREATE INDEX idx_detalle_venta
ON detalle_venta(id_venta);

CREATE INDEX idx_detalle_producto
ON detalle_venta(id_producto);