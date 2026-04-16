import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MENU } from '../../menu.config';

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
  menu = MENU;

  ngOnInit() {
    console.log('🔍 Empleado guardado:', this.authService.getEmpleadoLogueado());
    this.rol = this.authService.getRol()?.toLowerCase() || '';
  }

  puedeAcceder(item: any): boolean {
    console.log('Rol empleado:', this.rol);
    console.log('Rol item:', item.roles);
    return item.roles.includes(this.rol);
  }

  logOut(){
    this.authService.logout();
  }
}


