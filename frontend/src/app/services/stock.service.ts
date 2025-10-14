import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardStats {
  totalPrendas: number;
  stockBajo: number;
  sinStock: number;
  fechaActualizacion: string;
}

@Injectable({ providedIn: 'root' })
export class StockService {
  private apiUrl = 'http://localhost:3000/stock';

  constructor(private http: HttpClient) {}

  getPrendas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getTalles(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/talles');
  }

  crearPrenda(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  actualizarPrenda(codigo: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${codigo}`, data);
  }

  eliminarPrenda(codigo: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${codigo}`);
  }

  getStockTotal(codigo: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${codigo}/stock-total`);
  }

  ajustarStock(codigo: string, talle_id: number, cantidad: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${codigo}/ajustar`, { talle_id, cantidad });
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/stats`);
  }
}

