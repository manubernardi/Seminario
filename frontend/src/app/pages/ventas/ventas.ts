import { Component } from '@angular/core';
import { VentasService } from '../../services/ventas.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-ventas',
  imports: [CommonModule, RouterLink],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css'
})
export class Ventas {
  ventas: any[] = [];
  ventaSeleccionada: any = null;
  constructor(private readonly ventasService: VentasService) {}
  ngOnInit(): void {
  
    this.ventasService.getVentas().subscribe((data) => {
      this.ventas = data;
      console.log(data);
    });

  }
  verDetalles(venta: any): void {
    this.ventaSeleccionada = venta;
  }

  cerrarModal(): void {
    this.ventaSeleccionada = null;
  }
}

