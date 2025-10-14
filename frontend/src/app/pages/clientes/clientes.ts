import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  telefono?: string;
}

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class Clientes implements OnInit {
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  clienteForm: FormGroup;
  
  mostrarModal: boolean = false;
  modoEdicion: boolean = false;
  clienteEditando: Cliente | null = null;
  guardando: boolean = false;
  
  busqueda: string = '';
  
  private apiUrl = 'http://localhost:3000/clientes';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.http.get<Cliente[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.clientes = data;
        this.clientesFiltrados = data;
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
        alert('Error al cargar clientes');
      }
    });
  }

  filtrarClientes(): void {
    const termino = this.busqueda.toLowerCase().trim();
    
    if (!termino) {
      this.clientesFiltrados = this.clientes;
      return;
    }

    this.clientesFiltrados = this.clientes.filter(cliente =>
      cliente.nombre.toLowerCase().includes(termino) ||
      cliente.apellido.toLowerCase().includes(termino)
    );
  }

  abrirModalNuevo(): void {
    this.modoEdicion = false;
    this.clienteEditando = null;
    this.clienteForm.reset();
    this.mostrarModal = true;
  }

  abrirModalEditar(cliente: Cliente): void {
    this.modoEdicion = true;
    this.clienteEditando = cliente;
    this.clienteForm.patchValue(cliente);
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.clienteForm.reset();
    this.clienteEditando = null;
  }

  guardarCliente(): void {
    if (this.clienteForm.invalid) {
      alert('Complete todos los campos obligatorios correctamente');
      return;
    }

    this.guardando = true;

    if (this.modoEdicion && this.clienteEditando) {
      // Actualizar cliente existente
      this.http.patch<Cliente>(`${this.apiUrl}/${this.clienteEditando.id}`, this.clienteForm.value).subscribe({
        next: (clienteActualizado) => {
          const index = this.clientes.findIndex(c => c.id === clienteActualizado.id);
          if (index !== -1) {
            this.clientes[index] = clienteActualizado;
          }
          this.filtrarClientes();
          alert('Cliente actualizado correctamente');
          this.cerrarModal();
          this.guardando = false;
        },
        error: (error) => {
          console.error('Error al actualizar cliente:', error);
          alert(error.error?.message || 'Error al actualizar el cliente');
          this.guardando = false;
        }
      });
    } else {
      // Crear nuevo cliente
      this.http.post<Cliente>(this.apiUrl, this.clienteForm.value).subscribe({
        next: (nuevoCliente) => {
          this.clientes.push(nuevoCliente);
          this.filtrarClientes();
          alert('Cliente registrado correctamente');
          this.cerrarModal();
          this.guardando = false;
        },
        error: (error) => {
          console.error('Error al guardar cliente:', error);
          alert(error.error?.message || 'Error al guardar el cliente');
          this.guardando = false;
        }
      });
    }
  }

  eliminarCliente(cliente: Cliente): void {
    if (!confirm(`¿Está seguro de eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`)) {
      return;
    }

    this.http.delete(`${this.apiUrl}/${cliente.id}`).subscribe({
      next: () => {
        this.clientes = this.clientes.filter(c => c.id !== cliente.id);
        this.filtrarClientes();
        alert('Cliente eliminado correctamente');
      },
      error: (error) => {
        console.error('Error al eliminar cliente:', error);
        alert(error.error?.message || 'Error al eliminar el cliente');
      }
    });
  }
}