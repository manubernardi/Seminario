import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { StockService, DashboardStats } from '../../services/stock.service';
import { RouterLink } from '@angular/router';

declare var bootstrap: any;

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

interface Talle {
  codigo: number;
  descripcion: string;
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

  verStockBajo = false;
  verSinStock = false;
  modalStockTitulo = '';
  modalStockLista: any[] = [];

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

  cargarDashboardStats(): void {
    this.stockService.getDashboardStats().subscribe({
      next: (data) => {(this.dashboardStats = data);
        console.log('Dashboard Stats:', this.dashboardStats);
      },
      
      error: (error) => console.error('Error al cargar estadísticas:', error)
    });
  }

  cargarPrendas(): void {
    this.stockService.getPrendas().subscribe({
      next: (data) => {
        //Ordenas los los talles de cada prenda de menor a mayor (s - XXXl)
        this.prendas = data.map(prenda => ({...prenda, prendasXTalles: this.ordenarPorTalles(prenda.prendasXTalles)}));
        this.prendasFiltradas = data.map(prenda => ({...prenda, prendasXTalles: this.ordenarPorTalles(prenda.prendasXTalles)}));

      },
      error: (error) => {
        console.error('Error al cargar prendas:', error);
        alert('Error al cargar el stock');
      }
    });
  }

  ordenarPorTalles(talles: PrendaXTalle[]): PrendaXTalle[] {
    const orden = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

    return [...talles].sort((a, b) => { //Copia el array original para no mutarlo
      // sort() decide la posición de dos elementos consecutivos comparándolos.
      const ta = this.getTalleDescripcion(a.talle_id); // descripción del talle A
      const tb = this.getTalleDescripcion(b.talle_id); // descripción del talle B

      const aEsNumero = !isNaN(Number(ta));
      const bEsNumero = !isNaN(Number(tb));

      // ambos numéricos → orden numérico
      if (aEsNumero && bEsNumero) return Number(ta) - Number(tb);
      // Si el resultado es positivo --> b va antes que a
      // Si el resultado es negativo --> a va antes que b
      // Si el resultado es cero --> a y b son iguales, no cambia

      // ambos texto → orden según tabla
      if (!aEsNumero && !bEsNumero) {
        return orden.indexOf(ta) - orden.indexOf(tb);
      }

      // mixto → decidís prioridad (ej: primero letras)
      return aEsNumero ? 1 : -1;
    });
  }

  cargarTalles(): void {
    this.stockService.getTalles().subscribe({
      next: (data) => (this.talles = data),
      error: (error) => console.error('Error al cargar talles:', error)
    });
  }

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

  ajustarStock(prenda_codigo: string, talle_id: number, delta: number): void {
    this.stockService.ajustarStock(prenda_codigo, talle_id, delta).subscribe({
      next: (actualizado) => {
        console.log('Stock ajustado:', actualizado);
        this.cargarPrendas();
        this.cargarDashboardStats();
      },
      error: (error) => {
        console.error('Error al ajustar stock:', error);
        alert('Error al ajustar el stock');
      }
    });
  }

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
  
  getTalleDescripcion(codigo: number): string {
    const talle = this.talles.find(t => t.codigo === codigo);
    return talle ? talle.descripcion : 'Desconocido';
  }

  ordenarPrendas(prenda: Prenda): string {
    if (!prenda.codigo) return '';
    return prenda.codigo.split('-').map(part => part.trim()).join(' ');
  }

  //MODAL STOCK BAJO
  abrirModalStock(tipo: 'bajo' | 'sinStock') {
  if (tipo === 'bajo') {
    this.modalStockTitulo = 'Prendas con stock bajo';
    this.modalStockLista = this.dashboardStats?.prendasStockBajo || [];
  } else {
    this.modalStockTitulo = 'Prendas sin stock';
    this.modalStockLista = this.dashboardStats?.prendasSinStock || [];
  }
  const modalEl = document.getElementById('modalStock');
  this.modalInstance = new bootstrap.Modal(modalEl);
  this.modalInstance.show();
}
}
