// compras.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateDetalleCompraDto {
  codigoPrenda: string;
  talleId: number;
  cantidad: number;
  precioUnitario: number;
}

export interface CreateCompraDto {
  empleadoLegajo: number;
  proveedorId: number;
  detalles: CreateDetalleCompraDto[];
}

export interface Compra {
  NumCompra: number;
  fecha: Date;
  montoTotal: number;
  empleado: any;
  detalles: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ComprasService {
  private apiUrl = 'http://localhost:3000/compras';

  constructor(private http: HttpClient) {}

  // Crear nueva compra
  nuevaCompra(compraDto: CreateCompraDto): Observable<any> {
    console.log('📦 Enviando compra:', compraDto);
    return this.http.post(this.apiUrl, compraDto);
  }

  // Listar todas las compras
  obtenerCompras(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Obtener una compra específica
  obtenerCompraPorId(numCompra: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${numCompra}`);
  }

  // Obtener compras por empleado
  obtenerComprasPorEmpleado(legajo: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/empleado/${legajo}`);
  }

  // Obtener compras por rango de fechas
  obtenerComprasPorFecha(fechaInicio: string, fechaFin: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/fecha/rango`, {
      params: { inicio: fechaInicio, fin: fechaFin }
    });
  }
}