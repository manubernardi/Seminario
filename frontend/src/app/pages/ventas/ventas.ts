import { Component } from '@angular/core';
import { VentasService } from '../../services/ventas.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ventas',
  imports: [CommonModule],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css'
})
export class Ventas {
  ventas: any[] = [];
  constructor(private readonly ventasService: VentasService) {}
  ngOnInit(): void {
  
    this.ventasService.getVentas().subscribe((data) => {
      this.ventas = data;
      console.log(data);
    });

}
}
