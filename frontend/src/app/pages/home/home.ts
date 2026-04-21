import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MENU } from '../../menu.config';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  constructor(private authService: AuthService) {}

  rol: string = '';
  menu = MENU;
  empleado: any;

  ngOnInit() {
    this.empleado = this.authService.getEmpleadoLogueado();
    this.rol = this.authService.getRol()?.toLowerCase() || '';

    console.log('🔍 Empleado:', this.empleado);
    console.log('🔍 Rol:', this.rol);
  }

  puedeAcceder(item: any): boolean {
    return item.roles.includes(this.rol);
  }

  logOut() {
    this.authService.logout();
  }
}


