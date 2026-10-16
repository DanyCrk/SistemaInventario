import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { MovimientoInventario } from '../models/movimiento-inventario.ts';

@Injectable({
  providedIn: 'root'
})
export class MovimientoInventarioService {

  private apiUrl = 'http://localhost:8080/movimientos';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<MovimientoInventario[]> {
    return this.http.get<MovimientoInventario[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<MovimientoInventario> {
    return this.http.get<MovimientoInventario>(`${this.apiUrl}/${id}`);
  }

  registrar(
    movimiento: MovimientoInventario,
    idProducto: number,
    idTipoMovimiento: number
  ): Observable<MovimientoInventario> {

    const params = new HttpParams()
      .set('idProducto', idProducto)
      .set('idTipoMovimiento', idTipoMovimiento);

    return this.http.post<MovimientoInventario>(
      this.apiUrl,
      movimiento,
      { params }
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}