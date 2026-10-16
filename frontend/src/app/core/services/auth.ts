import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UsuarioSesion {
  idUsuario: number;
  nombre: string;
  correo: string;
  rol: {
    idRol: number;
    nombre: string;
  };
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/auth';
  private readonly STORAGE_KEY = 'usuarioSesion';

  constructor(private http: HttpClient) {}

  login(correo: string, password: string): Observable<UsuarioSesion> {
    return this.http.post<UsuarioSesion>(`${this.apiUrl}/login`, { correo, password });
  }

  guardarSesion(usuario: UsuarioSesion): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuario));
  }

  obtenerUsuario(): UsuarioSesion | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  estaAutenticado(): boolean {
    return this.obtenerUsuario() !== null;
  }

  esAdministrador(): boolean {
    return this.obtenerUsuario()?.rol?.nombre === 'Administrador';
  }

  cerrarSesion(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}