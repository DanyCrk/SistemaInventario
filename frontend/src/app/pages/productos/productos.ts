import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Producto } from '../../core/models/producto';
import { ProductoService } from '../../core/services/producto';
import { Categoria } from '../../core/models/categoria';
import { CategoriaService } from '../../core/services/categoria';

@Component({
  selector: 'app-productos',
  imports: [DecimalPipe, CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class Productos implements OnInit {

  productos: Producto[] = [];
  categorias: Categoria[] = [];

  cargando = false;
  error = '';

  mostrarFormulario = false;
  modoEdicion = false;
  // --- Paginación ---
  paginaActual = 1;
  tamanioPagina = 10;

  productoActual: Producto = this.productoVacio();

  // --- Buscador de la tabla principal (por código) ---
  busquedaTabla = '';

  // --- Buscador de categoría dentro del formulario ---
  busquedaCategoria = '';
  mostrarListaCategorias = false;
  categoriaSeleccionada: Categoria | null = null;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.listarProductos();
    this.cargarCategorias();
  }

  listarProductos(): void {

    this.cargando = true;
    this.error = '';

    this.productoService.listarTodos().subscribe({

      next: (productos) => {
        this.productos = productos;
        this.cargando = false;
      },

      error: (error) => {
        console.error('Error al obtener productos:', error);
        this.error = 'No se pudieron cargar los productos.';
        this.cargando = false;
      }

    });
  }

  cargarCategorias(): void {
    this.categoriaService.listarTodos().subscribe({
      next: (categorias) => this.categorias = categorias,
      error: (error) => console.error('Error al cargar categorías:', error)
    });
  }

  productoVacio(): Producto {
    return {
      codigo: '',
      nombre: '',
      descripcion: '',
      precioCompra: 0,
      precioVenta: 0,
      stock: 0,
      stockMinimo: 0,
      categoria: { idCategoria: 0, nombre: '' },
      activo: true
    };
  }

  // --- Bloquear cambio de valor con la rueda del mouse ---
  bloquearScroll(event: WheelEvent): void {
    (event.target as HTMLInputElement).blur();
  }

  // --- Buscador de la tabla principal (por código o nombre) ---
  get productosFiltradosTabla(): Producto[] {

    const termino = this.busquedaTabla.trim().toLowerCase();

    if (!termino) {
      return this.productos;
    }

    return this.productos.filter(p =>
      p.codigo.toLowerCase().includes(termino) ||
      p.nombre.toLowerCase().includes(termino)
    );
  }
  get productosOrdenados(): Producto[] {
  return [...this.productosFiltradosTabla].sort((a, b) => (b.idProducto || 0) - (a.idProducto || 0));
}

get totalPaginas(): number {
  return Math.ceil(this.productosOrdenados.length / this.tamanioPagina) || 1;
}

get productosPaginados(): Producto[] {
  const inicio = (this.paginaActual - 1) * this.tamanioPagina;
  return this.productosOrdenados.slice(inicio, inicio + this.tamanioPagina);
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

  // --- Buscador de categoría dentro del formulario ---
  get categoriasFiltradas(): Categoria[] {

    const termino = this.busquedaCategoria.trim().toLowerCase();

    if (!termino) {
      return this.categorias;
    }

    return this.categorias.filter(c =>
      c.nombre.toLowerCase().includes(termino)
    );
  }

  onBuscarCategoria(): void {
    this.mostrarListaCategorias = true;
  }

  seleccionarCategoria(categoria: Categoria): void {
    this.categoriaSeleccionada = categoria;
    this.productoActual.categoria = { idCategoria: categoria.idCategoria, nombre: categoria.nombre };
    this.busquedaCategoria = categoria.nombre;
    this.mostrarListaCategorias = false;
  }

  // --- Abrir formulario ---
  abrirCrear(): void {
    this.modoEdicion = false;
    this.productoActual = this.productoVacio();
    this.busquedaCategoria = '';
    this.categoriaSeleccionada = null;
    this.error = '';
    this.mostrarFormulario = true;
  }

  editarProducto(producto: Producto): void {
    this.modoEdicion = true;
    this.productoActual = { ...producto, categoria: { ...producto.categoria } };
    this.busquedaCategoria = producto.categoria?.nombre || '';
    this.categoriaSeleccionada = producto.categoria
      ? { idCategoria: producto.categoria.idCategoria, nombre: producto.categoria.nombre }
      : null;
    this.error = '';
    this.mostrarFormulario = true;
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.error = '';
  }

  guardarProducto(): void {

    if (!this.productoActual.categoria.idCategoria) {
      this.error = 'Selecciona una categoría válida de la lista.';
      return;
    }

    if (this.modoEdicion && this.productoActual.idProducto) {

      this.productoService.actualizar(this.productoActual.idProducto, this.productoActual).subscribe({

        next: () => {
          this.mostrarFormulario = false;
          this.listarProductos();
        },

        error: (error) => {
          console.error('Error al actualizar producto:', error);
          this.error = 'No se pudo actualizar el producto.';
        }

      });

    } else {

      this.productoService.crear(this.productoActual).subscribe({

        next: () => {
          this.mostrarFormulario = false;
          this.listarProductos();
        },

        error: (error) => {
          console.error('Error al crear producto:', error);
          this.error = 'No se pudo crear el producto.';
        }

      });
    }
  }

  eliminarProducto(producto: Producto): void {

    if (!producto.idProducto) {
      return;
    }

    const confirmar = confirm(`¿Seguro que quieres eliminar "${producto.nombre}"?`);

    if (!confirmar) {
      return;
    }

    this.productoService.eliminar(producto.idProducto).subscribe({

      next: () => {
        this.listarProductos();
      },

      error: (error) => {
        console.error('Error al eliminar producto:', error);
        this.error = 'No se pudo eliminar el producto. Puede que tenga movimientos asociados.';
      }

    });
  }
}