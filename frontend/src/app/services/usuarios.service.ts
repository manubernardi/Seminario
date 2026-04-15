import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap} from 'rxjs/operators';

interface EmpleadoDTO{
    nombre: string;
    apellido: string;
    dni: string;
    rol_id: number
    password?: string
}

@Injectable({
  providedIn: 'root'
})

export class UsuariosService {
  private userSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  user$ = this.userSubject.asObservable();
  private apiUrl = 'http://localhost:3000/empleados'; // URL del backend

  constructor(private http: HttpClient) {}

  nuevoUsuario(body: EmpleadoDTO): Observable<EmpleadoDTO> {

    console.log("Service front" , body)
    return this.http.post<EmpleadoDTO>(`${this.apiUrl}/register`, body).pipe(
      catchError(error => {
        console.error('Error al registrar usuario:', error);
        return throwError(() => new Error('Error al registrar usuario. Intenta nuevamente.'));
      })
    );
  }
  
  verificarEmpleado(): Observable<any> {
    return this.http.get(`http://localhost:3000/auth/me`);
  }

  setUser(user: any) {
    this.userSubject.next(user);
  }

  clearUser() {
    this.userSubject.next(null);
    localStorage.removeItem('user');
  }

  private getUserFromStorage() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
 
