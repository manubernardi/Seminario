import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  telefono: number;
}

interface Prenda {
  codigo: string;
  descripcion: string;
  precio: number;
  cantidad: number;
}

interface DetalleVenta {
  codigoPrenda: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  subtotal: number;
}

@Component({
  selector: 'app-nueva-venta',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DecimalPipe, DatePipe, RouterModule],
  templateUrl: './registrar-venta.html',
  styleUrls: ['./registrar-venta.css']
})
export class RegistrarVenta implements OnInit {
  ventaForm: FormGroup;
  clienteForm: FormGroup;
  clientes: Cliente[] = [];
  prendas: Prenda[] = [];
  detalles: DetalleVenta[] = [];
  
  prendaSeleccionada: Prenda | null = null;
  cantidadSeleccionada: number = 1;
  fechaActual: Date = new Date();
  empleadoLogueado: any = null;
  mostrarModalCliente: boolean = false;
  guardandoCliente: boolean = false;

  private apiUrl = 'http://localhost:3000';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    this.ventaForm = this.fb.group({
      empleadoId: [{ value: '', disabled: true }, Validators.required],
      clienteId:[{ value: '', disabled: true }],   // empezamos deshabilitado
      clienteHabilitado: [false]  
    });

    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarEmpleadoLogueado();
    this.cargarClientes();
    this.cargarPrendas();

    this.ventaForm.get('clienteHabilitado')?.valueChanges.subscribe(enabled => {
      const clienteCtrl = this.ventaForm.get('clienteId');
      if (enabled) {
        clienteCtrl?.enable({ emitEvent: false });
      } else {
        clienteCtrl?.disable({ emitEvent: false });
        clienteCtrl?.setValue('');
      }
    });
    
  }

  cargarEmpleadoLogueado(): void {
    this.empleadoLogueado = this.authService.getEmpleadoLogueado();
    
    if (this.empleadoLogueado) {
      this.ventaForm.patchValue({
        empleadoId: this.empleadoLogueado.legajo
      });
    } else {
      alert('Debe iniciar sesión para registrar ventas');
      this.router.navigate(['/login']);
    }
  }

  cargarClientes(): void {
    this.http.get<Cliente[]>(`${this.apiUrl}/clientes`).subscribe({
      next: (data) => {
        this.clientes = data;
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
        alert('Error al cargar clientes');
      }
    });
  }

  cargarPrendas(): void {
    this.http.get<Prenda[]>(`${this.apiUrl}/stock`).subscribe({
      next: (data) => {
        this.prendas = data.filter(p => p.cantidad > 0);
      },
      error: (error) => {
        console.error('Error al cargar prendas:', error);
        alert('Error al cargar prendas');
      }
    });
  }

 clienteHabilitado = false;

  
  abrirModalCliente(): void {
    const habilitado = this.ventaForm.get('clienteHabilitado')?.value;
    if (habilitado) {
      this.mostrarModalCliente = true;
      this.clienteForm.reset();
    }
  }

  cerrarModalCliente(): void {
    this.mostrarModalCliente = false;
    this.clienteForm.reset();
  }

  guardarNuevoCliente(): void {
    if (this.clienteForm.invalid) {
      alert('Complete todos los campos obligatorios');
      return;
    }

    this.guardandoCliente = true;

    this.http.post<Cliente>(`${this.apiUrl}/clientes`, this.clienteForm.value).subscribe({
      next: (nuevoCliente) => {
        this.clientes.push(nuevoCliente);
        this.ventaForm.patchValue({ clienteId: nuevoCliente.id });
        alert('Cliente registrado correctamente');
        this.cerrarModalCliente();
        this.guardandoCliente = false;
      },
      error: (error) => {
        console.error('Error al guardar cliente:', error);
        alert(error.error?.message || 'Error al guardar el cliente');
        this.guardandoCliente = false;
      }
    });
  }

  onPrendaChange(): void {
    this.cantidadSeleccionada = 1;
  }

  agregarPrenda(): void {
    if (!this.prendaSeleccionada || this.cantidadSeleccionada <= 0) {
      return;
    }

    if (this.cantidadSeleccionada > this.prendaSeleccionada.cantidad) {
      alert(`Solo hay ${this.prendaSeleccionada.cantidad} unidades disponibles`);
      return;
    }

    const detalleExistente = this.detalles.find(d => d.codigoPrenda === this.prendaSeleccionada!.codigo);
    
    if (detalleExistente) {
      const nuevaCantidad = detalleExistente.cantidad + this.cantidadSeleccionada;
      
      if (nuevaCantidad > this.prendaSeleccionada.cantidad) {
        alert(`Solo hay ${this.prendaSeleccionada.cantidad} unidades disponibles`);
        return;
      }
      
      detalleExistente.cantidad = nuevaCantidad;
      detalleExistente.subtotal = detalleExistente.precio * nuevaCantidad;
    } else {
      const detalle: DetalleVenta = {
        codigoPrenda: this.prendaSeleccionada.codigo,
        descripcion: this.prendaSeleccionada.descripcion,
        precio: this.prendaSeleccionada.precio,
        cantidad: this.cantidadSeleccionada,
        subtotal: this.prendaSeleccionada.precio * this.cantidadSeleccionada
      };
      
      this.detalles.push(detalle);
    }

    this.prendaSeleccionada = null;
    this.cantidadSeleccionada = 1;
  }

  eliminarDetalle(index: number): void {
    this.detalles.splice(index, 1);
  }

  calcularTotal(): number {
    return this.detalles.reduce((total, detalle) => total + detalle.subtotal, 0);
  }

  guardarVenta(): void {
    if (this.ventaForm.invalid) {
      alert('Debe seleccionar un cliente');
      return;
    }

    if (this.detalles.length === 0) {
      alert('Agregue al menos una prenda');
      return;
    }

    const empleadoId = this.ventaForm.get('empleadoId')?.value;
    const clienteId = this.ventaForm.get('clienteId')?.value;
    const formValues = this.ventaForm.getRawValue();

    console.log('formValues completo:', formValues)

    const ventaData: any = {
      empleadoLegajo: Number(this.empleadoLogueado?.legajo),
      clienteId: formValues.clienteId ? Number(formValues.clienteId) : undefined,
      detalles: this.detalles.map(d => ({
      codigoPrenda: d.codigoPrenda,
      cantidad: d.cantidad
      }))
    };

    console.log('Datos a enviar:', ventaData);

    this.http.post(`${this.apiUrl}/ventas`, ventaData).subscribe({
      next: (response) => {
        alert('Venta registrada correctamente');
        this.router.navigate(['/ventas']);
      },
      error: (error) => {
        console.error('Error al guardar venta:', error);
        alert(error.error?.message || 'Error al guardar la venta');
      }
    });
  }

  cancelar(): void {
    if (this.detalles.length > 0) {
      if (confirm('¿Está seguro de cancelar? Se perderán los datos ingresados')) {
        this.router.navigate(['/ventas']);
      }
    } else {
      this.router.navigate(['/ventas']);
    }
  }
}