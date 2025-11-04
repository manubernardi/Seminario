import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClientesService, Cliente } from '../../services/clientes.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './clientes.html',
  styleUrls: ['./clientes.css']
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  clienteForm: FormGroup;

  mostrarModal = false;
  modoEdicion = false;
  clienteEditando: Cliente | null = null;
  guardando = false;
  busqueda = '';

  constructor(
    private clienteService: ClientesService,
    private fb: FormBuilder
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
    this.clienteService.cargarClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.filtrarClientes();
      },
      error: (error) => console.error('Error al cargar clientes:', error)
    });
  }

  filtrarClientes(): void {
    const termino = this.busqueda.toLowerCase().trim();
    this.clientesFiltrados = !termino
      ? this.clientes
      : this.clientes.filter(c =>
          c.nombre.toLowerCase().includes(termino) ||
          c.apellido.toLowerCase().includes(termino)
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
      alert('Complete todos los campos obligatorios');
      return;
    }

    this.guardando = true;
    const clienteData = this.clienteForm.value;

    if (this.modoEdicion && this.clienteEditando) {
      // Actualizar cliente
      this.clienteService.actualizarCliente(this.clienteEditando.id, clienteData).subscribe({
        next: (clienteActualizado) => {
          const index = this.clientes.findIndex(c => c.id === clienteActualizado.id);
          if (index !== -1) this.clientes[index] = clienteActualizado;
          this.filtrarClientes();
          alert('Cliente actualizado correctamente');
          this.cerrarModal();
          this.guardando = false;
        },
        error: (error) => {
          console.error('Error al actualizar cliente:', error);
          alert('Error al actualizar el cliente');
          this.guardando = false;
        }
      });
    } else {
      // Crear nuevo cliente
      this.clienteService.crearCliente(clienteData).subscribe({
        next: (nuevoCliente) => {
          this.clientes.push(nuevoCliente);
          this.filtrarClientes();
          alert('Cliente creado correctamente');
          this.cerrarModal();
          this.guardando = false;
        },
        error: (error) => {
          console.error('Error al crear cliente:', error);
          alert('Error al crear el cliente');
          this.guardando = false;
        }
      });
    }
  }

  eliminarCliente(cliente: Cliente): void {
    if (!confirm(`¿Está seguro de eliminar a ${cliente.nombre} ${cliente.apellido}?`)) return;

    this.clienteService.eliminarCliente(cliente.id).subscribe({
      next: () => {
        this.clientes = this.clientes.filter(c => c.id !== cliente.id);
        this.filtrarClientes();
        alert('Cliente eliminado correctamente');
      },
      error: (error) => {
        console.error('Error al eliminar cliente:', error);
        alert('Error al eliminar el cliente');
      }
    });
  }
}
