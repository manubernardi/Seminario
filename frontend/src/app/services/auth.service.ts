import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UsuariosService } from './usuarios.service';

export interface EmpleadoAuth {
  legajo: number;
  nombre: string;
  apellido: string;
  dni: string;
  password?:string;
  rol: {
    id: number;
    nombre: string;
  };
  permissions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  private empleado = signal<EmpleadoAuth | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private empleadoService: UsuariosService
  ) {}

  login(data: {dni: string, password?: string}): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
      tap(response => {
        console.log('Respuesta del backend:', response);
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        this.empleadoService.setUser(response.empleado);
        localStorage.setItem('empleado', JSON.stringify(response.empleado));
      })
    );
  }


  logout(): void {
    localStorage.clear();
    this.empleado.set(null);
    this.router.navigate(['/login']);
  }

  getEmpleadoLogueado(): EmpleadoAuth | null {
    return JSON.parse(localStorage.getItem('empleado') || 'null');

  }

  getRol(): string | null {
    const empleado = this.getEmpleadoLogueado();
    return empleado?.rol?.nombre || null;
  }

  isAuthenticated(): boolean {
    return this.getEmpleadoLogueado() !== null;
  }
}
