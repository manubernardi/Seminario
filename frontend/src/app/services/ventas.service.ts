// frontend/src/app/services/ventas.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getVentas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/ventas`);
  }

  getClientes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/clientes`);
  }

  getPrendas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stock`);
  }

  getTalles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/talles`);
  }

  crearCliente(cliente: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/clientes`, cliente);
  }

  crearVenta(venta: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/ventas`, venta);
  }
}
