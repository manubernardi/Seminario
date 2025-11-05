// proveedores.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Proveedor {
  id: number;
  razonSocial: string;
  telefono: string;
  mail: string;
}

export interface CreateProveedorDto {
  razonSocial: string;
  telefono: string;
  mail: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  private apiUrl = 'http://localhost:3000/proveedores';

  constructor(private http: HttpClient) {}

  // Listar todos los proveedores
  obtenerProveedores(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Obtener un proveedor por ID
  obtenerProveedorPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Crear nuevo proveedor
  nuevoProveedor(proveedorDto: CreateProveedorDto): Observable<any> {
    console.log(proveedorDto);
    return this.http.post(this.apiUrl, proveedorDto);
  }

  // Actualizar proveedor
  actualizarProveedor(id: number, proveedorDto: Partial<CreateProveedorDto>): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, proveedorDto);
  }

  // Eliminar proveedor
  eliminarProveedor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}