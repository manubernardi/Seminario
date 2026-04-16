import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MENU } from '../../menu.config';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, RouterLink],
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
    return item.roles.includes(this.rol);
  }

  logOut(){
    this.authService.logout();
  }
}


