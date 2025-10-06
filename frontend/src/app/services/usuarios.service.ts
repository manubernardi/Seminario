import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap} from 'rxjs/operators';

export interface RegistroDto{
    nombre: string;
    apellido: string;
    dni: number;
    rol: string;
}

export interface EmpleadoBackend{
    nombre: string;
    apellido: string;
    dni: number;
    rol: string;
    legajo: number;
    rolId: number;
}

@Injectable({
  providedIn: 'root'
})

export class UsuariosService {
  private apiUrl = 'http://localhost:3000/empleados'; // URL del backend

  constructor(private http: HttpClient) {}

  nuevoUsuario(body: RegistroDto): Observable<EmpleadoBackend>{
    return this.http.post<any>(this.apiUrl, body);
  }
 
}