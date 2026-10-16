import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Proveedor } from '../../core/models/proveedores';
import { ProveedorService } from '../../core/services/proveedores';

@Component({
  selector: 'app-proveedores',
  imports: [CommonModule, FormsModule],
  templateUrl: './proveedores.html',
  styleUrl: './proveedores.css'
})
export class Proveedores implements OnInit {

  proveedores: Proveedor[] = [];

  cargando = false;
  error = '';

  mostrarFormulario = false;
  modoEdicion = false;

  proveedorActual: Proveedor = this.proveedorVacio();

  constructor(
    private proveedorService: ProveedorService
  ) {}

  ngOnInit(): void {
    this.listarProveedores();
  }

  listarProveedores(): void {

    this.cargando = true;
    this.error = '';

    this.proveedorService.listarTodos().subscribe({

      next: (proveedores) => {
        this.proveedores = proveedores;
        this.cargando = false;
      },

      error: (error) => {
        console.error('Error al obtener proveedores:', error);
        this.error = 'No se pudieron cargar los proveedores.';
        this.cargando = false;
      }

    });
  }

  proveedorVacio(): Proveedor {
    return {
      nombre: '',
      nit: '',
      telefono: '',
      correo: '',
      direccion: '',
      activo: true
    };
  }

  abrirCrear(): void {
    this.modoEdicion = false;
    this.proveedorActual = this.proveedorVacio();
    this.mostrarFormulario = true;
    this.error = '';
  }

  editarProveedor(proveedor: Proveedor): void {
    this.modoEdicion = true;
    this.proveedorActual = { ...proveedor };
    this.mostrarFormulario = true;
    this.error = '';
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
  }

  guardarProveedor(): void {

    if (this.modoEdicion && this.proveedorActual.idProveedor) {

      this.proveedorService.actualizar(this.proveedorActual.idProveedor, this.proveedorActual).subscribe({

        next: () => {
          this.mostrarFormulario = false;
          this.listarProveedores();
        },

        error: (error) => {
          console.error('Error al actualizar proveedor:', error);
          this.error = 'No se pudo actualizar el proveedor.';
        }

      });

    } else {

      this.proveedorService.crear(this.proveedorActual).subscribe({

        next: () => {
          this.mostrarFormulario = false;
          this.listarProveedores();
        },

        error: (error) => {
          console.error('Error al crear proveedor:', error);
          this.error = 'No se pudo crear el proveedor.';
        }

      });
    }
  }

  eliminarProveedor(proveedor: Proveedor): void {

    if (!proveedor.idProveedor) {
      return;
    }

    const confirmar = confirm(`¿Seguro que quieres eliminar a "${proveedor.nombre}"?`);

    if (!confirmar) {
      return;
    }

    this.proveedorService.eliminar(proveedor.idProveedor).subscribe({

      next: () => {
        this.listarProveedores();
      },

      error: (error) => {
        console.error('Error al eliminar proveedor:', error);
        this.error = 'No se pudo eliminar el proveedor. Puede que tenga movimientos asociados.';
      }

    });
  }
}