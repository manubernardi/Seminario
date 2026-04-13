import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UsuariosService } from './usuarios.service';

export interface EmpleadoAuth {
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
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

  cargarEmpleado() {
    return this.http.get<any>(`${this.apiUrl}/me`).subscribe(emp => {
      this.empleado.set(emp);
    });
  }

  getEmpleado() {
    return this.empleado();
  }

  hasPermission(permiso: string): boolean {
    return this.empleado()?.permissions?.includes(permiso) || false;
  }

  logout(): void {
    localStorage.clear();
    this.empleado.set(null);
    this.router.navigate(['/login']);
  }

  getEmpleadoLogueado(): EmpleadoAuth | null {
    const empleadoStr = localStorage.getItem('empleado');
    if (!empleadoStr) return null;
    
    try {
      return JSON.parse(empleadoStr);
    } catch {
      return null;
    }
  }

  getEmpleadoId(): string | null {
    const empleado = this.getEmpleadoLogueado();
    return empleado?.dni || null;
  }

  getDni(): string | null {
    return localStorage.getItem('dni');
  } 

  isAuthenticated(): boolean {
    return this.getEmpleadoLogueado() !== null;
  }
}
