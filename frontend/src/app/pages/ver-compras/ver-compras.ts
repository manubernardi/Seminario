import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ComprasService } from '../../services/compras.service';

@Component({
  selector: 'app-ver-compras',
  imports: [CommonModule, RouterModule],
  templateUrl: './ver-compras.html',
  styleUrl: './ver-compras.css'
})
export class VerCompras implements OnInit {
  compras: any[] = [];
  compraSeleccionada: any = null;
  modalAbierto = false;

  constructor(private comprasService: ComprasService) {}

  ngOnInit() {
  this.comprasService.obtenerCompras().subscribe({
    next: (data: any) => {
  this.compras = data.data;
    },
    error: (err: any) => console.error('Error al obtener compras:', err)
  });
}

  verDetalles(compra: any) {
    this.compraSeleccionada = compra;
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.compraSeleccionada = null;
  }
}