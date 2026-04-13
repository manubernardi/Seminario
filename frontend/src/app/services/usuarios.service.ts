import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap} from 'rxjs/operators';

interface EmpleadoFrontend{
    nombre: string;
    apellido: string;
    dni: string;
    rol_id: number
    password?: string
}


export interface EmpleadoBackend{
    nombre: string;
    apellido: string;
    dni: string;
    rol_id: {
      id: number,
      nombre: string
    };
    password?: string  
}

@Injectable({
  providedIn: 'root'
})

export class UsuariosService {
  private apiUrl = 'http://localhost:3000/empleados'; // URL del backend

  constructor(private http: HttpClient) {}

  nuevoUsuario(body: EmpleadoFrontend): Observable<EmpleadoBackend> {

    console.log("Service front" , body)
    return this.http.post<EmpleadoBackend>(`${this.apiUrl}/register`, body).pipe(
      catchError(error => {
        console.error('Error al registrar usuario:', error);
        return throwError(() => new Error('Error al registrar usuario. Intenta nuevamente.'));
      })
    );
  }
  
  verificarEmpleado(dni: string): Observable<any> {
    return this.http.get(`http://localhost:3000/auth/verificar/${dni}`);
  }
}
 
