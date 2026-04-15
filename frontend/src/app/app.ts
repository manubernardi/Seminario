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
    const accessToken = localStorage.getItem('accessToken');
    console.log('🔍 accessToken guardado:', accessToken);

    
    if (accessToken) {
      console.log('📡 Llamando a verificar empleado...');
      this.usuarioService.verificarEmpleado().subscribe({
        next: (response) => {
          console.log('✅ Sesión válida:', response);
        },
        error: (err) => {
          console.log('❌ Error completo:', err);
          console.log('❌ URL llamada:', err.url); 
          console.log('❌ Status:', err.status);
          console.log('❌ Empleado no existe o fue eliminado');
          alert('Tu sesión ha expirado. Vuelve a iniciar sesión.');
          localStorage.clear();
          this.router.navigate(['/login']);
        }
      });
    }
  }
}
