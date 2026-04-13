import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { UsuariosService } from './services/usuarios.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('frontend');
  private usuarioService = inject(UsuariosService);
  private router = inject(Router);
  
  ngOnInit() {
    this.verificarSesion();
  }

  verificarSesion() {
    console.log(localStorage);
    const dni = localStorage.getItem('empleado') ? JSON.parse(localStorage.getItem('empleado')!).dni : null;
     console.log('🔍 empleado guardado:', dni);

    
    if (dni) {
      console.log('📡 Llamando a verificar empleado...');
      this.usuarioService.verificarEmpleado(dni).subscribe({
        next: (response) => {
          console.log('✅ Sesión válida:', response);
        },
        error: (err) => {
          console.log('❌ Error completo:', err);
          console.log('❌ URL llamada:', err.url);  // <- ESTO ES CLAVE
          console.log('❌ Status:', err.status);
          console.log('❌ Empleado no existe o fue eliminado');
          alert('Tu sesión ha expirado. El empleado fue eliminado del sistema.');
          localStorage.clear();
          this.router.navigate(['/login']);
        }
      });
    }
  }
}
