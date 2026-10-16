import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Cliente } from '../../core/models/cliente';
import { ClienteService } from '../../core/services/cliente';
import { Venta } from '../../core/models/venta';
import { VentaService } from '../../core/services/venta';

@Component({
  selector: 'app-clientes',
  imports: [CommonModule, FormsModule, DecimalPipe, DatePipe],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class Clientes implements OnInit {

  clientes: Cliente[] = [];
  ventas: Venta[] = [];

  cargando = false;
  error = '';

  mostrarFormulario = false;
  modoEdicion = false;

  clienteActual: Cliente = this.clienteVacio();

  // --- Filtro por fecha y número de compras ---
  fechaDesde = '';
  fechaHasta = '';
  minCompras: number | null = null;
  maxCompras: number | null = null;

  // --- Modal de compras de un cliente ---
  mostrarCompras = false;
  clienteSeleccionadoCompras: Cliente | null = null;

  constructor(
    private clienteService: ClienteService,
    private ventaService: VentaService
  ) {}

  ngOnInit(): void {
    this.listarClientes();
    this.cargarVentas();
  }

  listarClientes(): void {

    this.cargando = true;
    this.error = '';

    this.clienteService.listarTodos().subscribe({

      next: (clientes) => {
        this.clientes = clientes;
        this.cargando = false;
      },

      error: (error) => {
        console.error('Error al obtener clientes:', error);
        this.error = 'No se pudieron cargar los clientes.';
        this.cargando = false;
      }

    });
  }

  cargarVentas(): void {
    this.ventaService.listarTodos().subscribe({
      next: (ventas) => this.ventas = ventas,
      error: (error) => console.error('Error al cargar ventas:', error)
    });
  }

  clienteVacio(): Cliente {
    return {
      nombre: '',
      documento: '',
      telefono: '',
      correo: '',
      direccion: '',
      activo: true
    };
  }

  // --- Ventas de un cliente, respetando el rango de fechas del filtro ---
  ventasDeCliente(idCliente: number | undefined): Venta[] {

    if (!idCliente) {
      return [];
    }

    return this.ventas.filter(venta => {

      if (venta.cliente?.idCliente !== idCliente) {
        return false;
      }

      if (!venta.fecha) {
        return true;
      }

      const fechaVenta = venta.fecha.substring(0, 10);

      if (this.fechaDesde && fechaVenta < this.fechaDesde) {
        return false;
      }

      if (this.fechaHasta && fechaVenta > this.fechaHasta) {
        return false;
      }

      return true;
    });
  }

  cantidadCompras(idCliente: number | undefined): number {
    return this.ventasDeCliente(idCliente).length;
  }

  totalComprado(idCliente: number | undefined): number {
    return this.ventasDeCliente(idCliente).reduce((acumulado, venta) => acumulado + venta.total, 0);
  }

  // --- Filtro de la tabla (por cantidad de compras en el rango de fecha) ---
  get clientesFiltrados(): Cliente[] {

    return this.clientes.filter(cliente => {

      const compras = this.cantidadCompras(cliente.idCliente);

      if (this.minCompras !== null && compras < this.minCompras) {
        return false;
      }

      if (this.maxCompras !== null && compras > this.maxCompras) {
        return false;
      }

      return true;
    });
  }

  limpiarFiltro(): void {
    this.fechaDesde = '';
    this.fechaHasta = '';
    this.minCompras = null;
    this.maxCompras = null;
  }

  // --- Bloquear cambio de valor con la rueda del mouse ---
  bloquearScroll(event: WheelEvent): void {
    (event.target as HTMLInputElement).blur();
  }

  // --- Modal de compras ---
  verCompras(cliente: Cliente): void {
    this.clienteSeleccionadoCompras = cliente;
    this.mostrarCompras = true;
  }

  cerrarCompras(): void {
    this.mostrarCompras = false;
    this.clienteSeleccionadoCompras = null;
  }

  // --- CRUD (sin cambios) ---
  abrirCrear(): void {
    this.modoEdicion = false;
    this.clienteActual = this.clienteVacio();
    this.mostrarFormulario = true;
    this.error = '';
  }

  editarCliente(cliente: Cliente): void {
    this.modoEdicion = true;
    this.clienteActual = { ...cliente };
    this.mostrarFormulario = true;
    this.error = '';
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
  }

  guardarCliente(): void {

    if (this.modoEdicion && this.clienteActual.idCliente) {

      this.clienteService.actualizar(this.clienteActual.idCliente, this.clienteActual).subscribe({

        next: () => {
          this.mostrarFormulario = false;
          this.listarClientes();
        },

        error: (error) => {
          console.error('Error al actualizar cliente:', error);
          this.error = 'No se pudo actualizar el cliente.';
        }

      });

    } else {

      this.clienteService.crear(this.clienteActual).subscribe({

        next: () => {
          this.mostrarFormulario = false;
          this.listarClientes();
        },

        error: (error) => {
          console.error('Error al crear cliente:', error);
          this.error = 'No se pudo crear el cliente.';
        }

      });
    }
  }

  eliminarCliente(cliente: Cliente): void {

    if (!cliente.idCliente) {
      return;
    }

    const confirmar = confirm(`¿Seguro que quieres eliminar a "${cliente.nombre}"?`);

    if (!confirmar) {
      return;
    }

    this.clienteService.eliminar(cliente.idCliente).subscribe({

      next: () => {
        this.listarClientes();
      },

      error: (error) => {
        console.error('Error al eliminar cliente:', error);
        this.error = 'No se pudo eliminar el cliente. Puede que tenga ventas asociadas.';
      }

    });
  }
}