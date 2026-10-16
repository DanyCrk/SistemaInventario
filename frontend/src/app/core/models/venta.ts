export interface Venta {
  idVenta?: number;
  fecha?: string;
  usuario: UsuarioRef;
  cliente?: ClienteRef;
  metodoPago: MetodoPagoRef;
  subtotal: number;
  descuento: number;
  total: number;
  observacion?: string;
}

export interface UsuarioRef {
  idUsuario: number;
  nombre?: string;
}

export interface ClienteRef {
  idCliente: number;
  nombre?: string;
}

export interface MetodoPagoRef {
  idMetodoPago: number;
  nombre?: string;
}