import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TipoMovimiento } from '../models/tipo-movimiento';

@Injectable({
  providedIn: 'root'
})
export class TipoMovimientoService {

  private apiUrl = 'http://localhost:8080/tipomovimientos';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<TipoMovimiento[]> {
    return this.http.get<TipoMovimiento[]>(this.apiUrl);
  }
}