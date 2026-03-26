import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap} from 'rxjs/operators';

interface EmpleadoFrontend{
    nombre: string;
    apellido: string;
    dni: string;
    rol_id: number
    password: string
}


export interface EmpleadoBackend{
    nombre: string;
    apellido: string;
    dni: string;
    rol_id: {
      id: number,
      nombre: string
    };
    password: string

    
}

@Injectable({
  providedIn: 'root'
})

export class UsuariosService {
  private apiUrl = 'http://localhost:3000/empleados'; // URL del backend

  constructor(private http: HttpClient) {}

  nuevoUsuario(body: EmpleadoFrontend): Observable<EmpleadoBackend> {
    /*var data: EmpleadoBackend = { nombre: '', apellido: '', dni: '', rol_id: { id: 0, nombre: '' }, password: '' };
    data.nombre = body.nombre
    data.apellido = body.apellido
    data.dni = body.dni
    data.password = body.password
    if(body.rol_id == 1){
      data.rol_id = {
        id: 1,
        nombre: 'Supervisor'
      }
    }
    else if(body.rol_id == 2){
      data.rol_id = {
        id: 2,
        nombre: 'Vendedor'
      }
    }
    else if(body.rol_id == 3){
      data.rol_id = {
        id: 3,
        nombre: 'Comprador'
      }
    }*/

    console.log("Service front" , body)
    return this.http.post<EmpleadoBackend>(this.apiUrl, body).pipe(
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
 
