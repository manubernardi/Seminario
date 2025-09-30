// frontend/src/app/services/ventas.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  private apiUrl = 'http://localhost:3000/ventas'; // URL del backend

  constructor(private http: HttpClient) {}

  getVentas(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
