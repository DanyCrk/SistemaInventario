import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-setup',
  imports: [CommonModule, FormsModule],
  templateUrl: './setup.html',
  styleUrl: './setup.css'
})
export class Setup implements OnInit {

  correo = '';
  password = '';
  confirmarPassword = '';
  error = '';
  cargando = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Si ya existe un admin, no debería poder acceder a esta pantalla
    this.http.get<boolean>('http://localhost:8080/auth/necesita-setup').subscribe({
      next: (necesitaSetup) => {
        if (!necesitaSetup) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  crearAdmin(): void {

    if (!this.correo || !this.password) {
      this.error = 'Completa todos los campos.';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    if (this.password !== this.confirmarPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    this.cargando = true;
    this.error = '';

    this.http.post('http://localhost:8080/auth/setup-admin', {
      correo: this.correo,
      password: this.password
    }).subscribe({

     next: () => {
  this.cargando = false;
  this.router.navigate(['/login']).then(() => {
    alert('Cuenta de administrador creada. Ahora puedes iniciar sesión.');
  });
},

      error: (error) => {
        console.error('Error al crear administrador:', error);
        this.error = typeof error.error === 'string' ? error.error : 'No se pudo crear la cuenta.';
        this.cargando = false;
      }

    });
  }
}