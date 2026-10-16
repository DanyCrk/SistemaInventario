import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MovimientoInventario } from '../../core/models/movimiento-inventario.ts';
import { MovimientoInventarioService } from '../../core/services/movimiento-inventario';
import { Producto } from '../../core/models/producto';
import { ProductoService } from '../../core/services/producto';
import { TipoMovimiento } from '../../core/models/tipo-movimiento';
import { TipoMovimientoService } from '../../core/services/tipo-movimiento';

@Component({
  selector: 'app-inventario',
  imports: [DatePipe, CommonModule, FormsModule],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css'
})
export class Inventario implements OnInit {

  movimientos: MovimientoInventario[] = [];
  productos: Producto[] = [];
  tiposMovimiento: TipoMovimiento[] = [];

  cargando = false;
  error = '';
  // --- Filtro por fecha ---
  fechaDesde = '';
  fechaHasta = '';

// --- Paginación ---
  paginaActual = 1;
  tamanioPagina = 20;

  mostrarFormulario = false;

  // --- Buscador de producto en vivo ---
  busquedaProducto = '';
  mostrarListaProductos = false;
  productoSeleccionado: Producto | null = null;

  idTipoMovimientoSeleccionado = 0;

  movimientoActual: MovimientoInventario = this.movimientoVacio();

  constructor(
    private movimientoService: MovimientoInventarioService,
    private productoService: ProductoService,
    private tipoMovimientoService: TipoMovimientoService
  ) {}

  ngOnInit(): void {
  const hoy = this.obtenerFechaLocal();
  this.fechaDesde = hoy;
  this.fechaHasta = hoy;

  this.listarMovimientos();
  this.cargarProductos();
  this.cargarTiposMovimiento();
}

  listarMovimientos(): void {

    this.cargando = true;
    this.error = '';

    this.movimientoService.listarTodos().subscribe({

      next: (movimientos) => {
        this.movimientos = movimientos;
        this.cargando = false;
      },

      error: (error) => {
        console.error('Error al obtener movimientos:', error);
        this.error = 'No se pudieron cargar los movimientos.';
        this.cargando = false;
      }

    });
  }

  cargarProductos(): void {
    this.productoService.listarTodos().subscribe({
      next: (productos) => this.productos = productos,
      error: (error) => console.error('Error al cargar productos:', error)
    });
  }

  cargarTiposMovimiento(): void {
    this.tipoMovimientoService.listarTodos().subscribe({
      next: (tipos) => this.tiposMovimiento = tipos,
      error: (error) => console.error('Error al cargar tipos de movimiento:', error)
    });
  }

  movimientoVacio(): MovimientoInventario {
    return {
      producto: { idProducto: 0 },
      tipoMovimiento: { idTipoMovimiento: 0 },
      cantidad: 0,
      usuario: { idUsuario: 0 },
      observacion: ''
    };
  }

  // --- Bloquear cambio de valor con la rueda del mouse ---
  bloquearScroll(event: WheelEvent): void {
    (event.target as HTMLInputElement).blur();
  }

  // --- Buscador de producto en vivo ---
  get productosFiltrados(): Producto[] {

    const termino = this.busquedaProducto.trim().toLowerCase();

    if (!termino) {
      return [];
    }

    return this.productos.filter(p =>
      p.codigo.toLowerCase().includes(termino) ||
      p.nombre.toLowerCase().includes(termino)
    );
  }

  onBuscarProducto(): void {
    this.mostrarListaProductos = true;
    this.productoSeleccionado = null;
  }

  seleccionarProducto(producto: Producto): void {
    this.productoSeleccionado = producto;
    this.busquedaProducto = `${producto.codigo} - ${producto.nombre}`;
    this.mostrarListaProductos = false;
  }

  abrirCrear(): void {
    this.busquedaProducto = '';
    this.productoSeleccionado = null;
    this.idTipoMovimientoSeleccionado = 0;
    this.movimientoActual = this.movimientoVacio();
    this.mostrarFormulario = true;
    this.error = '';
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
  }

  guardarMovimiento(): void {

    if (!this.productoSeleccionado) {
      this.error = 'Busca y selecciona un producto de la lista.';
      return;
    }

    if (!this.idTipoMovimientoSeleccionado) {
      this.error = 'Selecciona un tipo de movimiento.';
      return;
    }

    if (!this.movimientoActual.cantidad || this.movimientoActual.cantidad <= 0) {
      this.error = 'La cantidad debe ser mayor a 0.';
      return;
    }

    if (!this.movimientoActual.usuario.idUsuario) {
      this.error = 'Indica el usuario que realiza el movimiento.';
      return;
    }

    this.movimientoService.registrar(
      this.movimientoActual,
      this.productoSeleccionado.idProducto!,
      this.idTipoMovimientoSeleccionado
    ).subscribe({

      next: () => {
        this.mostrarFormulario = false;
        this.listarMovimientos();
        this.cargarProductos();
      },

      error: (error) => {
        console.error('Error al registrar movimiento:', error);

        this.error = typeof error.error === 'string'
          ? error.error
          : 'No se pudo registrar el movimiento.';
      }

    });
  }

  eliminarMovimiento(movimiento: MovimientoInventario): void {

    if (!movimiento.idMovimiento) {
      return;
    }

    const confirmar = confirm(`¿Seguro que quieres eliminar el movimiento #${movimiento.idMovimiento}?`);

    if (!confirmar) {
      return;
    }

    this.movimientoService.eliminar(movimiento.idMovimiento).subscribe({

      next: () => {
        this.listarMovimientos();
      },

      error: (error) => {
        console.error('Error al eliminar movimiento:', error);
        this.error = 'No se pudo eliminar el movimiento.';
      }

    });
  }
  get movimientosFiltrados(): MovimientoInventario[] {

  let resultado = this.movimientos;

  if (this.fechaDesde || this.fechaHasta) {
    resultado = resultado.filter(movimiento => {

      if (!movimiento.fecha) {
        return false;
      }

      const fechaMov = movimiento.fecha.substring(0, 10);

      if (this.fechaDesde && fechaMov < this.fechaDesde) {
        return false;
      }

      if (this.fechaHasta && fechaMov > this.fechaHasta) {
        return false;
      }

      return true;
    });
  }

  return [...resultado].sort((a, b) => (b.idMovimiento || 0) - (a.idMovimiento || 0));
}

get totalPaginas(): number {
  return Math.ceil(this.movimientosFiltrados.length / this.tamanioPagina) || 1;
}

get movimientosPaginados(): MovimientoInventario[] {
  const inicio = (this.paginaActual - 1) * this.tamanioPagina;
  return this.movimientosFiltrados.slice(inicio, inicio + this.tamanioPagina);
}

irAPagina(pagina: number): void {
  if (pagina < 1 || pagina > this.totalPaginas) {
    return;
  }
  this.paginaActual = pagina;
}

paginaAnterior(): void {
  this.irAPagina(this.paginaActual - 1);
}

paginaSiguiente(): void {
  this.irAPagina(this.paginaActual + 1);
}

resetearPagina(): void {
  this.paginaActual = 1;
}

limpiarFiltroFecha(): void {
  this.fechaDesde = '';
  this.fechaHasta = '';
  this.resetearPagina();
}
private obtenerFechaLocal(): string {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}
}