import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UsuariosService } from '../services/usuarios.service';
import { catchError, map, of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private usuariosService: UsuariosService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    // Primera verificación: ¿Está autenticado?
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Segunda verificación: ¿El empleado existe en el sistema?
    const dni = localStorage.getItem('empleadoDni'); // Asegúrate de tener este método en AuthService
    
    if (!dni) {
      console.log('❌ No se encontró DNI en la sesión');
      localStorage.clear();
      this.router.navigate(['/login']);
      return false;
    }

    // Verificar que el empleado exista en cada navegación
    return this.usuariosService.verificarEmpleado(dni).pipe(
      map(response => {
        console.log('✅ Empleado verificado en guard');
        return true;
      }),
      catchError(err => {
        console.log('❌ Empleado no existe, redirigiendo a login');
        alert('Tu sesión ha expirado. El empleado fue eliminado del sistema.');
        localStorage.clear();
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}