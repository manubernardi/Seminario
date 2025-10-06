import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface EmpleadoAuth {
  id: number;
  nombre: string;
  apellido: string;
  legajo: string;
  rol: {
    id: number;
    nombre: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(data: { dni: string; isSupervisor?: boolean }): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
    tap(response => {
      console.log('Respuesta del backend:', response);
      if (response?.empleado) {
        localStorage.setItem('empleado', JSON.stringify(response.empleado));
      }
    })
  );
}



  logout(): void {
    localStorage.removeItem('empleado');
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

  getEmpleadoId(): number | null {
    const empleado = this.getEmpleadoLogueado();
    return empleado?.id || null;
  }

  isAuthenticated(): boolean {
    return this.getEmpleadoLogueado() !== null;
  }
}
