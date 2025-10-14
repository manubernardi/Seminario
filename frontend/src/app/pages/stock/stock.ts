import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { StockService, DashboardStats } from '../../services/stock.service';
import { RouterLink } from '@angular/router';

declare var bootstrap: any;

interface Talle {
  codigo: number;
  descripcion: string;
}

interface PrendaXTalle {
  talle_id: number;
  cantidad: number;
}

interface Prenda {
  codigo: string;
  descripcion: string;
  precio: number;
  cantidadTotal: number;
  prendasXTalles: PrendaXTalle[];
}

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DecimalPipe, RouterLink],
  templateUrl: './stock.html',
  styleUrls: ['./stock.css']
})
export class Stock implements OnInit {

  prendas: Prenda[] = [];
  prendasFiltradas: Prenda[] = [];
  talles: Talle[] = [];
  searchTerm: string = '';

  prendaForm: FormGroup;
  prendasXTallesForm: FormGroup[] = [];
  modoEdicion = false;
  dashboardStats: DashboardStats | null = null;

  private modalInstance: any;

  constructor(
    private fb: FormBuilder,
    private stockService: StockService
  ) {
    this.prendaForm = this.fb.group({
      codigo: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0.01)]],
    });
  }

  ngOnInit(): void {
    this.cargarPrendas();
    this.cargarTalles();
    this.cargarDashboardStats();
  }

  // 📊 Carga de estadísticas del dashboard
  cargarDashboardStats(): void {
    this.stockService.getDashboardStats().subscribe({
      next: (data) => (this.dashboardStats = data),
      error: (error) => console.error('Error al cargar estadísticas:', error)
    });
  }

  // 👕 Cargar prendas
  cargarPrendas(): void {
    this.stockService.getPrendas().subscribe({
      next: (data) => {
        //Ordenas los los talles de cada prenda de menor a mayor (s - XXXl)
        this.prendas = data.map(prenda => ({...prenda, prendasXTalles: this.ordenarTalles(prenda.prendasXTalles)}));
        this.prendasFiltradas = data.map(prenda => ({...prenda, prendasXTalles: this.ordenarTalles(prenda.prendasXTalles)}));

      },
      error: (error) => {
        console.error('Error al cargar prendas:', error);
        alert('Error al cargar el stock');
      }
    });
  }

  // 📏 Cargar talles
  cargarTalles(): void {
    this.stockService.getTalles().subscribe({
      next: (data) => (this.talles = data),
      error: (error) => console.error('Error al cargar talles:', error)
    });
  }

  // 🔍 Buscar prenda
  buscarPrendas(): void {
    const termino = this.searchTerm.trim().toLowerCase();
    this.prendasFiltradas = termino
      ? this.prendas.filter(
          p =>
            p.codigo.toLowerCase().includes(termino) ||
            p.descripcion.toLowerCase().includes(termino)
        )
      : this.prendas;
  }

  // 🔧 Ajustar stock
  ajustarStock(prenda_codigo: string, talle_id: number, delta: number): void {
    this.stockService.ajustarStock(prenda_codigo, talle_id, delta).subscribe({
      next: (actualizado) => {
        this.cargarPrendas();
        this.cargarDashboardStats();
      },
      error: (error) => {
        console.error('Error al ajustar stock:', error);
        alert('Error al ajustar el stock');
      }
    });
  }

  // ✏️ Editar prenda
  editarPrenda(prenda: Prenda): void {
    this.modoEdicion = true;
    this.prendaForm.patchValue({
      codigo: prenda.codigo,
      descripcion: prenda.descripcion,
      precio: prenda.precio
    });
    this.prendasXTallesForm = this.talles.map(talle => {
      const prendaXTalle = prenda.prendasXTalles.find(pt => pt.talle_id === talle.codigo);
      return this.fb.group({
        talle_id: [talle.codigo, Validators.required],
        cantidad: [prendaXTalle ? prendaXTalle.cantidad : 0, [Validators.required, Validators.min(0)]]
      });
    });
    this.abrirModal();
  }

  // ❌ Eliminar prenda
  eliminarPrenda(prenda: Prenda): void {
    if (!confirm(`¿Seguro que deseas eliminar ${prenda.descripcion}?`)) return;

    this.stockService.eliminarPrenda(prenda.codigo).subscribe({
      next: () => {
        alert('Prenda eliminada correctamente');
        this.cargarPrendas();
        this.cargarDashboardStats();
      },
      error: (error) => {
        console.error('Error al eliminar prenda:', error);
        alert('Error al eliminar la prenda');
      }
    });
  }

  // ➕ Nueva prenda
  abrirModalNuevaPrenda(): void {
    this.modoEdicion = false;
    this.prendaForm.reset({ codigo: '', descripcion: '', precio: 0 });
    this.prendasXTallesForm = this.talles.map(talle =>
      this.fb.group({
        talle_id: [talle.codigo, Validators.required],
        cantidad: [0, [Validators.required, Validators.min(0)]]
      })
    );
    this.abrirModal();
  }

  // 💾 Guardar (crear/editar)
  guardarPrenda(): void {
    if (this.prendaForm.invalid) {
      Object.values(this.prendaForm.controls).forEach(control => control.markAsTouched());
      return;
    }

    //Validar que al menos un talle tenga stock
    const tallesConStock = this.prendasXTallesForm
      .map(formGroup => formGroup.value)
      .filter((t: PrendaXTalle) => t.cantidad > 0);

    if (tallesConStock.length === 0) {
      alert('Debe asignar al menos una cantidad a un talle (puede dejar otros talles vacíos)');
      return;
    }
    const prendaData = {
      codigo: this.prendaForm.value.codigo,
      descripcion: this.prendaForm.value.descripcion,
      precio: Number(this.prendaForm.value.precio),
      prendasXTalles: tallesConStock.map(t => ({
        talle_id: Number(t.talle_id),
        cantidad: Number(t.cantidad)
      }))
    };

    const peticion = this.modoEdicion
      ? this.stockService.actualizarPrenda(prendaData.codigo, prendaData)
      : this.stockService.crearPrenda(prendaData);

    peticion.subscribe({
      next: () => {
        alert(`Prenda ${this.modoEdicion ? 'actualizada' : 'creada'} correctamente`);
        this.cerrarModal();
        this.cargarPrendas();
        this.cargarDashboardStats();
      },
      error: (error) => {
        console.error('Error al guardar prenda:', error);
        alert('Error al guardar la prenda');
      }
    });
  }

  // 📦 Obtener total de stock (si lo necesitas individualmente)
  getStockTotal(codigo: string): Observable<number> {
    return this.stockService.getStockTotal(codigo);
  }

  // 🧮 Filtrar prendas con stock bajo
  getPrendasStockBajo(): number {
    return this.prendas.filter(p => p.cantidadTotal < 5).length;
  }

  // 🪟 Modal helpers
  private abrirModal(): void {
    const modalElement = document.getElementById('modalPrenda');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
  }

  private cerrarModal(): void {
    if (this.modalInstance) this.modalInstance.hide();
  }
  
  getTalleDescripcion(talle_id: number): string {
    const talle = this.talles.find(t => t.codigo === talle_id);
    return talle ? talle.descripcion : 'Desconocido';
  }

  ordenarTalles(prendasXTalles: PrendaXTalle[]): PrendaXTalle[] {
    if (!prendasXTalles) return [];
    return prendasXTalles.sort((a, b) => {
      return a.talle_id - b.talle_id;
    });
  }
  ordenarPrendas(prenda: Prenda): string {
  if (!prenda.codigo) return '';

  return prenda.codigo.split('-').map(part => part.trim()).join(' ');
  }
}
