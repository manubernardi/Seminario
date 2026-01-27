import { Component } from '@angular/core';
import { ProveedoresService} from '../../services/proveedores.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
interface Proveedor{
  id: number;
  razonSocial: string;
  telefono: string;
  mail: string;
}
interface CreateProveedorDto{
  razonSocial: string;
  telefono: string;
  mail: string;
}
@Component({
  selector: 'app-proveedores',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './proveedores.html',
  styleUrl: './proveedores.css'
})
export class ProveedoresComponent{
  proveedores: Proveedor[] = [];
  proveedoresFiltrados: Proveedor[] = [];
  proveedorForm: FormGroup;
  busqueda: string = '';
  mostrarModal = false;
  modoEdicion = false;
  proveedorEditando: Proveedor | null = null;
  guardando = false;
  constructor(
    private proveedoresService: ProveedoresService,
    private fb: FormBuilder
  
  ) { this.proveedorForm = this.fb.group({
    razonSocial: ['', [Validators.required, Validators.minLength(3)]],
    telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    mail: ['', [Validators.required, Validators.email]]
  }); }
  

  ngOnInit() {
  this.proveedoresService.obtenerProveedores().subscribe({
    next: (data) => {
      this.proveedores = data;
      this.proveedoresFiltrados = data;
    },
    error: (err) => console.error(err)
  });
}

  filtrarProveedores(): void {
    const termino = this.busqueda.toLowerCase().trim();
    if (!termino) {
      this.proveedoresFiltrados = this.proveedores;
      return;
    }
    this.proveedoresFiltrados = this.proveedores.filter(proveedor =>
      proveedor.razonSocial.toLowerCase().includes(termino));
  }
  abrirModalNuevo(): void {
  this.modoEdicion = false;
  this.proveedorEditando = null;
  this.proveedorForm.reset();
  this.mostrarModal = true;
}
abrirModalEditar(proveedor: Proveedor): void {
  this.modoEdicion = true;
  this.proveedorEditando = proveedor;
  this.proveedorForm.patchValue(proveedor);
  this.mostrarModal = true;
}
cerrarModal(): void {
  this.mostrarModal = false;
  this.proveedorForm.reset();
  this.proveedorEditando = null;
}
 guardarProveedor(): void {
    if (this.proveedorForm.invalid) {
      alert('Complete todos los campos obligatorios');
      return;
    }

    this.guardando = true;
    const proveedorData = this.proveedorForm.value;
    const updateData: Partial<CreateProveedorDto> = this.proveedorForm.value;
    if (this.modoEdicion && this.proveedorEditando) {
      // Actualizar proveedor
      const id = this.proveedorEditando.id;
      console.log("id a editar", id);
      this.proveedoresService.actualizarProveedor(id, updateData).subscribe({
        next: (proveedorData) => {
          console.log("Proveedor actualizado", proveedorData);
          const index = this.proveedores.findIndex(c => c.id === proveedorData.id);
          if (index !== -1) this.proveedores[index] = proveedorData;
          this.filtrarProveedores();
          alert('Proveedor actualizado correctamente');
          this.cerrarModal();
          this.guardando = false;
        },
        error: (error) => {
          console.error('Error al actualizar proveedor:', error);
          alert('Error al actualizar el proveedor');
          this.guardando = false;
        }
      });
    } else {
      // Crear nuevo proveedor
      const createProveedorDto: CreateProveedorDto = {
        razonSocial: proveedorData.razonSocial,
        telefono: proveedorData.telefono,
        mail: proveedorData.mail
      };
      console.log("Controller",   createProveedorDto);
      this.proveedoresService.nuevoProveedor(createProveedorDto).subscribe({
        next: (nuevoProveedor) => {
          this.proveedores.push(nuevoProveedor);
          this.filtrarProveedores();
          alert('Proveedor creado correctamente');
          this.cerrarModal();
          this.guardando = false;
        },
        error: (error) => {
          console.error('Error al crear proveedor:', error);
          alert('Error al crear el proveedor');
          this.guardando = false;
        }
      });
    }
  }
  eliminarProveedor(proveedor: Proveedor): void {
    if (confirm(`¿Está seguro de eliminar al proveedor "${proveedor.razonSocial}"?`)) {
      this.proveedoresService.eliminarProveedor(proveedor.id).subscribe({
        next: () => {
          this.proveedores = this.proveedores.filter(p => p.id !== proveedor.id);
          this.filtrarProveedores();
          alert('Proveedor eliminado correctamente');
        },
        error: (error) => {
          console.error('Error al eliminar proveedor:', error);
          alert('Error al eliminar el proveedor');
        }
      });
    }
  }
}
