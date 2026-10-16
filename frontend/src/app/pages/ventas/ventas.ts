import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { from } from 'rxjs';
import { concatMap, toArray } from 'rxjs/operators';

import { Venta } from '../../core/models/venta';
import { VentaService } from '../../core/services/venta';
import { Producto } from '../../core/models/producto';
import { ProductoService } from '../../core/services/producto';
import { DetalleVenta } from '../../core/models/detalle-venta';
import { DetalleVentaService } from '../../core/services/detalle-venta';
import { MovimientoInventarioService } from '../../core/services/movimiento-inventario';
import { MetodoPago } from '../../core/models/metodo-pago';
import { MetodoPagoService } from '../../core/services/metodo-pago';

interface LineaVenta {
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

@Component({
  selector: 'app-ventas',
  imports: [DecimalPipe, DatePipe, CommonModule, FormsModule],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css'
})
export class Ventas implements OnInit {

  ventas: Venta[] = [];
  productos: Producto[] = [];
  metodosPago: MetodoPago[] = [];

  cargando = false;
  error = '';

  mostrarFormulario = false;
  modoEdicion = false;

  ventaActual: Venta = this.ventaVacia();
  idClienteInput: number | null = null;
  paginaActual = 1;
  tamanioPagina = 10;
  lineas: LineaVenta[] = [];
  busquedaProducto = '';
  mostrarListaProductos = false;
  productoResaltado: Producto | null = null;
  cantidadSeleccionada = 1;
  idTipoMovimientoSalida = 2;
  mostrarGestionMetodos = false;
  nuevoMetodoPagoNombre = '';
  metodoPagoEditando: MetodoPago | null = null;
  mostrarDetalle = false;
  detallesVenta: DetalleVenta[] = [];
  ventaSeleccionadaDetalle: Venta | null = null;
  fechaDesde = '';
  fechaHasta = '';
  metodoPagoFiltro = 0;
  constructor(
    private ventaService: VentaService,
    private productoService: ProductoService,
    private detalleVentaService: DetalleVentaService,
    private movimientoService: MovimientoInventarioService,
    private metodoPagoService: MetodoPagoService
  ) {}

  ngOnInit(): void {
    const hoy = this.obtenerFechaLocal();
    this.fechaDesde = hoy;
    this.fechaHasta = hoy;

    this.listarVentas();
    this.cargarProductos();
    this.cargarMetodosPago();
  }

  listarVentas(): void {

    this.cargando = true;
    this.error = '';

    this.ventaService.listarTodos().subscribe({

      next: (ventas) => {
        this.ventas = ventas;
        this.cargando = false;
      },

      error: (error) => {
        console.error('Error al obtener ventas:', error);
        this.error = 'No se pudieron cargar las ventas.';
        this.cargando = false;
      }

    });
  }
  private obtenerFechaLocal(): string {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

  cargarProductos(): void {
    this.productoService.listarTodos().subscribe({
      next: (productos) => this.productos = productos,
      error: (error) => console.error('Error al cargar productos:', error)
    });
  }

  cargarMetodosPago(): void {
    this.metodoPagoService.listarTodos().subscribe({
      next: (metodos) => this.metodosPago = metodos,
      error: (error) => console.error('Error al cargar métodos de pago:', error)
    });
  }
  abrirGestionMetodos(): void {
  this.mostrarGestionMetodos = true;
  this.nuevoMetodoPagoNombre = '';
  this.metodoPagoEditando = null;
}

cerrarGestionMetodos(): void {
  this.mostrarGestionMetodos = false;
}

agregarMetodoPago(): void {

  const nombre = this.nuevoMetodoPagoNombre.trim();

  if (!nombre) {
    return;
  }

  this.metodoPagoService.crear({ nombre, activo: true }).subscribe({

    next: () => {
      this.nuevoMetodoPagoNombre = '';
      this.cargarMetodosPago();
    },

    error: (error) => {
      console.error('Error al crear método de pago:', error);
      this.error = 'No se pudo crear el método de pago.';
    }

  });
}

editarMetodoPago(metodo: MetodoPago): void {
  this.metodoPagoEditando = { ...metodo };
}

guardarEdicionMetodoPago(): void {

  if (!this.metodoPagoEditando?.idMetodoPago) {
    return;
  }

  this.metodoPagoService.actualizar(this.metodoPagoEditando.idMetodoPago, this.metodoPagoEditando).subscribe({

    next: () => {
      this.metodoPagoEditando = null;
      this.cargarMetodosPago();
    },

    error: (error) => {
      console.error('Error al actualizar método de pago:', error);
      this.error = 'No se pudo actualizar el método de pago.';
    }

  });
}

cancelarEdicionMetodoPago(): void {
  this.metodoPagoEditando = null;
}

eliminarMetodoPago(metodo: MetodoPago): void {

  if (!metodo.idMetodoPago) {
    return;
  }

  const confirmar = confirm(`¿Eliminar el método de pago "${metodo.nombre}"?`);

  if (!confirmar) {
    return;
  }

  this.metodoPagoService.eliminar(metodo.idMetodoPago).subscribe({

    next: () => {
      this.cargarMetodosPago();
    },

    error: (error) => {
      console.error('Error al eliminar método de pago:', error);
      alert('No se pudo eliminar. Puede que este método de pago ya esté usado en alguna venta.');
    }

  });
}

  ventaVacia(): Venta {
    return {
      usuario: { idUsuario: 0 },
      cliente: undefined,
      metodoPago: { idMetodoPago: 0 },
      subtotal: 0,
      descuento: 0,
      total: 0,
      observacion: ''
    };
  }

  // --- Bloquear cambio de valor con la rueda del mouse ---
  bloquearScroll(event: WheelEvent): void {
    (event.target as HTMLInputElement).blur();
  }

  // --- Filtro en vivo de productos ---
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
    this.productoResaltado = null;
  }

  seleccionarProducto(producto: Producto): void {
    this.productoResaltado = producto;
    this.busquedaProducto = `${producto.codigo} - ${producto.nombre}`;
    this.mostrarListaProductos = false;
  }

  // --- Filtro por fecha ---
  get ventasFiltradas(): Venta[] {

  let resultado = this.ventas;

  if (this.fechaDesde || this.fechaHasta) {
    resultado = resultado.filter(venta => {

      if (!venta.fecha) {
        return false;
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

  if (this.metodoPagoFiltro) {
    resultado = resultado.filter(venta => venta.metodoPago?.idMetodoPago === this.metodoPagoFiltro);
  }

  return [...resultado].sort((a, b) => (b.idVenta || 0) - (a.idVenta || 0));
}

get totalPaginas(): number {
  return Math.ceil(this.ventasFiltradas.length / this.tamanioPagina) || 1;
}

get ventasPaginadas(): Venta[] {
  const inicio = (this.paginaActual - 1) * this.tamanioPagina;
  return this.ventasFiltradas.slice(inicio, inicio + this.tamanioPagina);
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
  this.metodoPagoFiltro = 0;
  this.resetearPagina();
}

  // --- Abrir formulario ---
  abrirCrear(): void {
    this.modoEdicion = false;
    this.ventaActual = this.ventaVacia();
    this.lineas = [];
    this.busquedaProducto = '';
    this.productoResaltado = null;
    this.cantidadSeleccionada = 1;
    this.idClienteInput = null;
    this.error = '';
    this.mostrarFormulario = true;
  }

  editarVenta(venta: Venta): void {
    this.modoEdicion = true;
    this.ventaActual = {
      ...venta,
      usuario: { ...venta.usuario },
      cliente: venta.cliente ? { ...venta.cliente } : undefined,
      metodoPago: { ...venta.metodoPago }
    };
    this.idClienteInput = venta.cliente?.idCliente ?? null;
    this.error = '';
    this.mostrarFormulario = true;
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.error = '';
  }

  // --- Construcción de líneas de venta ---
  agregarLinea(): void {

    const producto = this.productoResaltado;

    if (!producto) {
      this.error = 'Busca y selecciona un producto de la lista.';
      return;
    }

    if (this.cantidadSeleccionada <= 0) {
      this.error = 'La cantidad debe ser mayor a 0.';
      return;
    }

    const yaAgregado = this.lineas.find(l => l.producto.idProducto === producto.idProducto);
    const cantidadTotal = (yaAgregado?.cantidad || 0) + this.cantidadSeleccionada;

    if (cantidadTotal > producto.stock) {
      this.error = `Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}`;
      return;
    }

    if (yaAgregado) {
      yaAgregado.cantidad = cantidadTotal;
      yaAgregado.subtotal = yaAgregado.cantidad * yaAgregado.precioUnitario;
    } else {
      this.lineas.push({
        producto,
        cantidad: this.cantidadSeleccionada,
        precioUnitario: producto.precioVenta,
        subtotal: this.cantidadSeleccionada * producto.precioVenta
      });
    }

    this.productoResaltado = null;
    this.busquedaProducto = '';
    this.cantidadSeleccionada = 1;
    this.error = '';
  }

  eliminarLinea(index: number): void {
    this.lineas.splice(index, 1);
  }

  get subtotalCalculado(): number {
    return this.lineas.reduce((acumulado, linea) => acumulado + linea.subtotal, 0);
  }

  get totalCalculado(): number {
    const total = this.subtotalCalculado - (this.ventaActual.descuento || 0);
    return total > 0 ? total : 0;
  }
  get totalEdicion(): number {
  const total = (this.ventaActual.subtotal || 0) - (this.ventaActual.descuento || 0);
  return total > 0 ? total : 0;
}

  // --- Guardar (crear o editar) ---
  guardarVenta(): void {

    if (this.modoEdicion) {
      this.actualizarVentaExistente();
      return;
    }

    if (this.lineas.length === 0) {
      this.error = 'Agrega al menos un producto a la venta.';
      return;
    }

    if (!this.ventaActual.usuario.idUsuario) {
      this.error = 'Indica el usuario que realiza la venta.';
      return;
    }

    if (!this.ventaActual.metodoPago.idMetodoPago) {
      this.error = 'Selecciona un método de pago.';
      return;
    }

    this.ventaActual.cliente = this.idClienteInput
      ? { idCliente: this.idClienteInput }
      : undefined;

    this.ventaActual.subtotal = this.subtotalCalculado;
    this.ventaActual.total = this.totalCalculado;

    this.ventaService.crear(this.ventaActual).subscribe({

      next: (ventaCreada) => {
        this.registrarDetallesYMovimientos(ventaCreada.idVenta!);
      },

      error: (error) => {
        console.error('Error al crear venta:', error);
        this.error = 'No se pudo crear la venta. Verifica que el ID de cliente/usuario/método de pago existan.';
      }

    });
  }

  private registrarDetallesYMovimientos(idVenta: number): void {

    from(this.lineas).pipe(

      concatMap(linea => {

        const detalle: DetalleVenta = {
          venta: { idVenta },
          producto: { idProducto: linea.producto.idProducto! },
          cantidad: linea.cantidad,
          precioUnitario: linea.precioUnitario,
          subtotal: linea.subtotal
        };

        return this.detalleVentaService.crear(detalle).pipe(

          concatMap(() =>
            this.movimientoService.registrar(
              {
                producto: { idProducto: linea.producto.idProducto! },
                tipoMovimiento: { idTipoMovimiento: this.idTipoMovimientoSalida },
                cantidad: linea.cantidad,
                usuario: { idUsuario: this.ventaActual.usuario.idUsuario },
                venta: { idVenta },
                observacion: `Salida por venta #${idVenta}`
              },
              linea.producto.idProducto!,
              this.idTipoMovimientoSalida
            )
          )

        );
      }),

      toArray()

    ).subscribe({

      next: () => {
        this.mostrarFormulario = false;
        this.listarVentas();
        this.cargarProductos();

        const imprimir = confirm('Venta registrada con éxito. ¿Deseas imprimir la factura ahora?');
if (imprimir) {
  window.open(`index.html#/factura/${idVenta}`, '_blank');
}
      },

      error: (error) => {
        console.error('Error al registrar detalle/movimiento:', error);
        this.error = 'La venta se creó, pero hubo un error registrando el detalle o el stock. Revisa el inventario manualmente.';
      }

    });
  }

  private actualizarVentaExistente(): void {

    if (!this.ventaActual.idVenta) {
      return;
    }

    this.ventaActual.cliente = this.idClienteInput
      ? { idCliente: this.idClienteInput }
      : undefined;
    this.ventaActual.total = this.totalEdicion;

    this.ventaService.actualizar(this.ventaActual.idVenta, this.ventaActual).subscribe({

      next: () => {
        this.mostrarFormulario = false;
        this.listarVentas();
      },

      error: (error) => {
        console.error('Error al actualizar venta:', error);
        this.error = 'No se pudo actualizar la venta.';
      }

    });
  }

  eliminarVenta(venta: Venta): void {

    if (!venta.idVenta) {
      return;
    }

    const confirmar = confirm(`¿Seguro que quieres eliminar la venta #${venta.idVenta}?`);

    if (!confirmar) {
      return;
    }

    this.ventaService.eliminar(venta.idVenta).subscribe({

      next: () => {
        this.listarVentas();
      },

      error: (error) => {
        console.error('Error al eliminar venta:', error);
        this.error = 'No se pudo eliminar la venta. Puede que tenga movimientos de inventario asociados.';
      }

    });
  }

  // --- Ver detalle de una venta ---
  verDetalle(venta: Venta): void {

    if (!venta.idVenta) {
      return;
    }

    this.ventaSeleccionadaDetalle = venta;

    this.detalleVentaService.listarPorVenta(venta.idVenta).subscribe({

      next: (detalles) => {
        this.detallesVenta = detalles;
        this.mostrarDetalle = true;
      },

      error: (error) => {
        console.error('Error al obtener detalle:', error);
        this.error = 'No se pudo cargar el detalle de la venta.';
      }

    });
  }

  cerrarDetalle(): void {
    this.mostrarDetalle = false;
    this.detallesVenta = [];
    this.ventaSeleccionadaDetalle = null;
  }

  // --- Factura ---
  imprimirFactura(venta: Venta): void {
  if (!venta.idVenta) {
    return;
  }
  window.open(`index.html#/factura/${venta.idVenta}`, '_blank');
}

imprimirReporte(): void {

  const params = new URLSearchParams();

  if (this.fechaDesde) {
    params.set('desde', this.fechaDesde);
  }

  if (this.fechaHasta) {
    params.set('hasta', this.fechaHasta);
  }

  if (this.metodoPagoFiltro) {
    params.set('metodo', String(this.metodoPagoFiltro));
  }

  window.open(`index.html#/reporte-ventas?${params.toString()}`, '_blank');
}
}