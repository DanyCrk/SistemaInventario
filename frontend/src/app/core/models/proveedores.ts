export interface Proveedor {
  idProveedor?: number;
  nombre: string;
  nit?: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  activo: boolean;
  fechaCreacion?: string;
}