import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Categoria } from '../../core/models/categoria';
import { CategoriaService } from '../../core/services/categoria';
import { Producto } from '../../core/models/producto';
import { ProductoService } from '../../core/services/producto';

@Component({
  selector: 'app-categorias',
  imports: [CommonModule, FormsModule],
  templateUrl: './categoria.html',
  styleUrl: './categoria.css'
})
export class Categorias implements OnInit {

  categorias: Categoria[] = [];
  productos: Producto[] = [];

  cargando = false;
  error = '';

  mostrarFormulario = false;
  modoEdicion = false;

  categoriaActual: Categoria = this.categoriaVacia();

  // --- Modal de productos por categoría ---
  mostrarProductos = false;
  categoriaSeleccionada: Categoria | null = null;

  constructor(
    private categoriaService: CategoriaService,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    this.listarCategorias();
    this.cargarProductos();
  }

  listarCategorias(): void {

    this.cargando = true;
    this.error = '';

    this.categoriaService.listarTodos().subscribe({

      next: (categorias) => {
        this.categorias = categorias;
        this.cargando = false;
      },

      error: (error) => {
        console.error('Error al obtener categorías:', error);
        this.error = 'No se pudieron cargar las categorías.';
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

  categoriaVacia(): Categoria {
  return {
    nombre: '',
    descripcion: '',
    activo: true
  };
}

  productosDeCategoria(idCategoria: number | undefined): Producto[] {

    if (!idCategoria) {
      return [];
    }

    return this.productos.filter(p => p.categoria?.idCategoria === idCategoria);
  }

  cantidadProductos(idCategoria: number | undefined): number {
    return this.productosDeCategoria(idCategoria).length;
  }

  verProductos(categoria: Categoria): void {
    this.categoriaSeleccionada = categoria;
    this.mostrarProductos = true;
  }

  cerrarProductos(): void {
    this.mostrarProductos = false;
    this.categoriaSeleccionada = null;
  }

  abrirCrear(): void {
    this.modoEdicion = false;
    this.categoriaActual = this.categoriaVacia();
    this.mostrarFormulario = true;
    this.error = '';
  }

  editarCategoria(categoria: Categoria): void {
    this.modoEdicion = true;
    this.categoriaActual = { ...categoria };
    this.mostrarFormulario = true;
    this.error = '';
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
  }

  guardarCategoria(): void {

    if (this.modoEdicion && this.categoriaActual.idCategoria) {

      this.categoriaService.actualizar(this.categoriaActual.idCategoria, this.categoriaActual).subscribe({

        next: () => {
          this.mostrarFormulario = false;
          this.listarCategorias();
        },

        error: (error) => {
          console.error('Error al actualizar categoría:', error);
          this.error = 'No se pudo actualizar la categoría.';
        }

      });

    } else {

      this.categoriaService.crear(this.categoriaActual).subscribe({

        next: () => {
          this.mostrarFormulario = false;
          this.listarCategorias();
        },

        error: (error) => {
          console.error('Error al crear categoría:', error);
          this.error = 'No se pudo crear la categoría.';
        }

      });
    }
  }

  eliminarCategoria(categoria: Categoria): void {

    if (!categoria.idCategoria) {
      return;
    }

    if (this.cantidadProductos(categoria.idCategoria) > 0) {
      alert(`No puedes eliminar "${categoria.nombre}" porque tiene productos asociados.`);
      return;
    }

    const confirmar = confirm(`¿Seguro que quieres eliminar la categoría "${categoria.nombre}"?`);

    if (!confirmar) {
      return;
    }

    this.categoriaService.eliminar(categoria.idCategoria).subscribe({

      next: () => {
        this.listarCategorias();
      },

      error: (error) => {
        console.error('Error al eliminar categoría:', error);
        this.error = 'No se pudo eliminar la categoría.';
      }

    });
  }
}