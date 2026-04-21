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

  get menuFiltrado() { // Sólo las opciones que el usuario puede acceder
    return this.menu.filter(item => this.puedeAcceder(item));
  }

  getGridArea(index: number, total: number): string { // Cambia el grid-area según la posición del item
    const cols = 4; // máximo de columnas
    const colWidth = 2; // ancho de cada columna
    const colStart = 2; // offset desde la izquierda

    const col = index % cols; 
    const row = Math.floor(index / cols); 

    const cs = colStart + col * colWidth;
    const rs = 2 + row * 2;

    return `${rs} / ${cs} / ${rs + 2} / ${cs + colWidth}`;
  }

  logOut() {
    this.authService.logout();
  }
}


