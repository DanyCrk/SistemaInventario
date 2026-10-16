import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Rol } from '../models/rol';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private apiUrl = 'http://localhost:8080/roles';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.apiUrl);
  }
}