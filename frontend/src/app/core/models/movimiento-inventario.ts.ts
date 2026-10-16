export interface MovimientoInventario {
  idMovimiento?: number;
  fecha?: string;
  producto: ProductoRef;
  tipoMovimiento: TipoMovimientoRef;
  cantidad: number;
  usuario: UsuarioRef;
  proveedor?: ProveedorRef;
  venta?: VentaRef;
  observacion?: string;
}

export interface ProductoRef {
  idProducto: number;
  nombre?: string;
  codigo?: string;
}

export interface TipoMovimientoRef {
  idTipoMovimiento: number;
  nombre?: string;
}

export interface UsuarioRef {
  idUsuario: number;
  nombre?: string;
}

export interface ProveedorRef {
  idProveedor: number;
  nombre?: string;
}

export interface VentaRef {
  idVenta: number;
}