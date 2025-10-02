import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Talle {
  codigo: number;
  descripcion: string;
}

interface Prenda {
  codigo: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  talle?: Talle;
  // imagen?: string; // TODO: Descomentar cuando implementes las imágenes
}

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './stock.html',
  styleUrls: ['./stock.css']
})
export class Stock implements OnInit {
  prendas: Prenda[] = [];
  prendasFiltradas: Prenda[] = [];
  searchTerm: string = '';
  private apiUrl = 'http://localhost:3000/stock'; // Ajusta según tu backend

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarPrendas();
  }

  cargarPrendas(): void {
    this.http.get<Prenda[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.prendas = data;
        this.prendasFiltradas = data;
      },
      error: (error) => {
        console.error('Error al cargar prendas:', error);
        alert('Error al cargar el stock');
      }
    });
  }

  buscarPrendas(): void {
    if (!this.searchTerm.trim()) {
      this.prendasFiltradas = this.prendas;
      return;
    }

    const termino = this.searchTerm.toLowerCase();
    this.prendasFiltradas = this.prendas.filter(prenda => 
      prenda.codigo.toLowerCase().includes(termino) ||
      prenda.descripcion.toLowerCase().includes(termino)
    );
  }

  ajustarStock(prenda: Prenda, cantidad: number): void {
    const nuevaCantidad = prenda.cantidad + cantidad;
    
    if (nuevaCantidad < 0) {
      alert('El stock no puede ser negativo');
      return;
    }

    // Llamada al backend para ajustar stock
    this.http.post(`${this.apiUrl}/${prenda.codigo}/ajustar`, {
      cantidad: cantidad,
      motivo: cantidad > 0 ? 'Ingreso manual' : 'Egreso manual'
    }).subscribe({
      next: () => {
        prenda.cantidad = nuevaCantidad;
        alert(`Stock actualizado correctamente`);
      },
      error: (error) => {
        console.error('Error al ajustar stock:', error);
        alert('Error al ajustar el stock');
      }
    });
  }

  editarPrenda(prenda: Prenda): void {
    // TODO: Implementar modal o navegación para editar
    console.log('Editar prenda:', prenda);
    alert('Función de edición en desarrollo');
  }

  eliminarPrenda(prenda: Prenda): void {
    if (!confirm(`¿Estás seguro de eliminar la prenda ${prenda.descripcion}?`)) {
      return;
    }

    this.http.delete(`${this.apiUrl}/${prenda.codigo}`).subscribe({
      next: () => {
        this.prendas = this.prendas.filter(p => p.codigo !== prenda.codigo);
        this.prendasFiltradas = this.prendasFiltradas.filter(p => p.codigo !== prenda.codigo);
        alert('Prenda eliminada correctamente');
      },
      error: (error) => {
        console.error('Error al eliminar prenda:', error);
        alert('Error al eliminar la prenda');
      }
    });
  }

  abrirModalNuevaPrenda(): void {
    // TODO: Implementar modal o navegación para crear nueva prenda
    console.log('Abrir modal nueva prenda');
    alert('Función de nueva prenda en desarrollo');
  }

  getTotalStock(): number {
    return this.prendas.reduce((total, prenda) => total + prenda.cantidad, 0);
  }

  getPrendasStockBajo(): number {
    return this.prendas.filter(prenda => prenda.cantidad < 5).length;
  }
}