import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  correo = '';
  password = '';
  error = '';
  cargando = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}
  ngOnInit(): void {
    this.http.get<boolean>('http://localhost:8080/auth/necesita-setup').subscribe({
      next: (necesitaSetup) => {
        if (necesitaSetup) {
          this.router.navigate(['/setup']);
        }
      }
    });
  }

  iniciarSesion(): void {

    if (!this.correo || !this.password) {
      this.error = 'Ingresa tu correo y contraseña.';
      return;
    }

    this.cargando = true;
    this.error = '';

    this.authService.login(this.correo, this.password).subscribe({

      next: (usuario) => {
        this.authService.guardarSesion(usuario);
        this.cargando = false;
        this.router.navigate(['/dashboard']);
      },

      error: (error) => {
        console.error('Error al iniciar sesión:', error);
        this.error = typeof error.error === 'string' ? error.error : 'No se pudo iniciar sesión.';
        this.cargando = false;
      }

    });
  }
}