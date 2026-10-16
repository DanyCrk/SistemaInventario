import { Categoria } from './categoria';

export interface Producto {
  idProducto?: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  stockMinimo: number;
  categoria: Categoria;
  activo: boolean;
  fechaCreacion?: string;
}