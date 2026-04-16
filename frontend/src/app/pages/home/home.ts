import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './home.html',
  styleUrl: './home.css'
})

export class Home {
  
  constructor(
    private authService: AuthService,
  ) {}

  rol: string = '';

  ngOnInit() {
    console.log('🔍 Empleado guardado:', this.authService.getEmpleadoLogueado());
    this.rol = this.authService.getRol() || '';
  }

  puedeAcceder(rolRequerido: string): boolean {
    return this.rol === rolRequerido;
  }
}


