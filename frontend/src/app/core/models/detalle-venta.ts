export interface DetalleVenta {
  idDetalle?: number;
  venta: { idVenta: number };
  producto: {
    idProducto: number;
    nombre?: string;
    codigo?: string;
  };
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}