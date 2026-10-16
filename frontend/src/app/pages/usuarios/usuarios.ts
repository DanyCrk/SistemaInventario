import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Usuario } from '../../core/models/usuario';
import { UsuarioService } from '../../core/services/usuario';
import { Rol } from '../../core/models/rol';
import { RolService } from '../../core/services/rol';

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, FormsModule],
  templateUrl:'./usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios implements OnInit {

  usuarios: Usuario[] = [];
  roles: Rol[] = [];

  cargando = false;
  error = '';

  mostrarFormulario = false;
  modoEdicion = false;

  usuarioActual: Usuario = this.usuarioVacio();

  constructor(
    private usuarioService: UsuarioService,
    private rolService: RolService
  ) {}

  ngOnInit(): void {
    this.listarUsuarios();
    this.cargarRoles();
  }

  listarUsuarios(): void {

    this.cargando = true;
    this.error = '';

    this.usuarioService.listarTodos().subscribe({

      next: (usuarios) => {
        this.usuarios = usuarios;
        this.cargando = false;
      },

      error: (error) => {
        console.error('Error al obtener usuarios:', error);
        this.error = 'No se pudieron cargar los usuarios.';
        this.cargando = false;
      }

    });
  }

  cargarRoles(): void {
    this.rolService.listarTodos().subscribe({
      next: (roles) => this.roles = roles,
      error: (error) => console.error('Error al cargar roles:', error)
    });
  }

  usuarioVacio(): Usuario {
    return {
      nombre: '',
      correo: '',
      password: '',
      rol: { idRol: 0 },
      activo: true
    };
  }

  abrirCrear(): void {
    this.modoEdicion = false;
    this.usuarioActual = this.usuarioVacio();
    this.mostrarFormulario = true;
    this.error = '';
  }

  editarUsuario(usuario: Usuario): void {
    this.modoEdicion = true;
    this.usuarioActual = {
      ...usuario,
      rol: { ...usuario.rol },
      password: '' // por seguridad, no se precarga la contraseña actual
    };
    this.mostrarFormulario = true;
    this.error = '';
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
  }

  guardarUsuario(): void {

    if (this.modoEdicion && this.usuarioActual.idUsuario) {

      this.usuarioService.actualizar(this.usuarioActual.idUsuario, this.usuarioActual).subscribe({

        next: () => {
          this.mostrarFormulario = false;
          this.listarUsuarios();
        },

        error: (error) => {
          console.error('Error al actualizar usuario:', error);
          this.error = 'No se pudo actualizar el usuario.';
        }

      });

    } else {

      this.usuarioService.crear(this.usuarioActual).subscribe({

        next: () => {
          this.mostrarFormulario = false;
          this.listarUsuarios();
        },

        error: (error) => {
          console.error('Error al crear usuario:', error);
          this.error = 'No se pudo crear el usuario.';
        }

      });
    }
  }

  eliminarUsuario(usuario: Usuario): void {

    if (!usuario.idUsuario) {
      return;
    }

    const confirmar = confirm(`¿Seguro que quieres eliminar a "${usuario.nombre}"?`);

    if (!confirmar) {
      return;
    }

    this.usuarioService.eliminar(usuario.idUsuario).subscribe({

      next: () => {
        this.listarUsuarios();
      },

      error: (error) => {
        console.error('Error al eliminar usuario:', error);
        this.error = 'No se pudo eliminar el usuario. Puede que tenga ventas o movimientos asociados.';
      }

    });
  }
}