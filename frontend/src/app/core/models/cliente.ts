export interface Cliente {
  idCliente?: number;
  nombre: string;
  documento?: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  activo: boolean;
  fechaCreacion?: string;
}