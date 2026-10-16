import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DetalleVenta } from '../models/detalle-venta';

@Injectable({
  providedIn: 'root'
})
export class DetalleVentaService {

  private apiUrl = 'http://localhost:8080/detalleventas';

  constructor(private http: HttpClient) {}

  listarPorVenta(idVenta: number): Observable<DetalleVenta[]> {
    return this.http.get<DetalleVenta[]>(`${this.apiUrl}/venta/${idVenta}`);
  }

  crear(detalle: DetalleVenta): Observable<DetalleVenta> {
    return this.http.post<DetalleVenta>(this.apiUrl, detalle);
  }
}