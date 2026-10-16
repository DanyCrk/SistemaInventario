import { Rol } from './rol';

export interface Usuario {
  idUsuario?: number;
  nombre: string;
  correo: string;
  password: string;
  rol: Rol;
  activo: boolean;
  fechaCreacion?: string;
}