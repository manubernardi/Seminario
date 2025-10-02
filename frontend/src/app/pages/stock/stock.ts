import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

declare var bootstrap: any;

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
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DecimalPipe],
  templateUrl: './stock.html',
  styleUrls: ['./stock.css']
})
export class Stock implements OnInit {
  prendas: Prenda[] = [];
  prendasFiltradas: Prenda[] = [];
  talles: Talle[] = [];
  searchTerm: string = '';
  prendaForm: FormGroup;
  modoEdicion: boolean = false;
  private apiUrl = 'http://localhost:3000/stock';
  private modalInstance: any;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.prendaForm = this.fb.group({
      codigo: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      cantidad: [0, [Validators.required, Validators.min(0)]],
      talle_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarPrendas();
    this.cargarTalles();
  }

  cargarTalles(): void {
    this.http.get<Talle[]>('http://localhost:3000/talles').subscribe({
      next: (data) => {
        this.talles = data;
      },
      error: (error) => {
        console.error('Error al cargar talles:', error);
      }
    });
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
    this.modoEdicion = true;
    this.prendaForm.patchValue({
      codigo: prenda.codigo,
      descripcion: prenda.descripcion,
      precio: prenda.precio,
      cantidad: prenda.cantidad,
      talle_id: prenda.talle?.codigo || ''
    });
    this.abrirModal();
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
    this.modoEdicion = false;
    this.prendaForm.reset({
      codigo: '',
      descripcion: '',
      precio: 0,
      cantidad: 0,
      talle_id: ''
    });
    this.abrirModal();
  }

  private abrirModal(): void {
    const modalElement = document.getElementById('modalPrenda');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
  }

  private cerrarModal(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  guardarPrenda(): void {
    if (this.prendaForm.invalid) {
      Object.keys(this.prendaForm.controls).forEach(key => {
        this.prendaForm.get(key)?.markAsTouched();
      });
      return;
    }

    const prendaData = { ...this.prendaForm.value,
    talle_id: Number(this.prendaForm.value.talle_id) // para pasar lo del talle_ID a Talle con letra
    };

    if (this.modoEdicion) {
      // Actualizar prenda existente
      this.http.put(`${this.apiUrl}/${prendaData.codigo}`, prendaData).subscribe({
        next: (response) => {
          alert('Prenda actualizada correctamente');
          this.cargarPrendas();
          this.cerrarModal();
        },
        error: (error) => {
          console.error('Error al actualizar prenda:', error);
          alert('Error al actualizar la prenda');
        }
      });
    } else {
      // Crear nueva prenda
      this.http.post(this.apiUrl, prendaData).subscribe({
        next: (response) => {
          alert('Prenda creada correctamente');
          this.cargarPrendas();
          this.cerrarModal();
        },
        error: (error) => {
          console.error('Error al crear prenda:', error);
          alert(error.error?.message || 'Error al crear la prenda');
        }
      });
    }
  }

  getTotalStock(): number {
    return this.prendas.reduce((total, prenda) => total + prenda.cantidad, 0);
  }

  getPrendasStockBajo(): number {
    return this.prendas.filter(prenda => prenda.cantidad < 5).length;
  }
}