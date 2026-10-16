import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { MetodoPago } from '../models/metodo-pago';

@Injectable({
  providedIn: 'root'
})
export class MetodoPagoService {

  private apiUrl = 'http://localhost:8080/metodospago';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<MetodoPago[]> {
    return this.http.get<MetodoPago[]>(this.apiUrl);
  }

  crear(metodoPago: MetodoPago): Observable<MetodoPago> {
    return this.http.post<MetodoPago>(this.apiUrl, metodoPago);
  }

  actualizar(id: number, metodoPago: MetodoPago): Observable<MetodoPago> {
    return this.http.put<MetodoPago>(`${this.apiUrl}/${id}`, metodoPago);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}