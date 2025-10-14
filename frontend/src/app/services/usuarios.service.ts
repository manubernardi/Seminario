import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap} from 'rxjs/operators';


export interface EmpleadoBackend{
    nombre: string;
    apellido: string;
    dni: string;
    telefono: string;
    rol_id: number;
    
}

@Injectable({
  providedIn: 'root'
})

export class UsuariosService {
  private apiUrl = 'http://localhost:3000/empleados'; // URL del backend

  constructor(private http: HttpClient) {}

  nuevoUsuario(body: EmpleadoBackend): Observable<EmpleadoBackend> {
    console.log("Service front" , body)
    return this.http.post<EmpleadoBackend>(this.apiUrl, body).pipe(
      catchError(error => {
        console.error('Error al registrar usuario:', error);
        return throwError(() => new Error('Error al registrar usuario. Intenta nuevamente.'));
      })
    );
  }
}
 
