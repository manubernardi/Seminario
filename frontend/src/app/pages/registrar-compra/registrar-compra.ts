// nueva-compra.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ComprasService, CreateDetalleCompraDto } from '../../services/compras.service';
import { ProveedoresService, Proveedor } from '../../services/proveedores.service';
import { StockService } from '../../services/stock.service';

interface DetalleConInfo extends CreateDetalleCompraDto {
  descripcionPrenda: string;
  descripcionTalle: string;
  subtotal: number;
}

@Component({
  selector: 'app-registrar-compra',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registrar-compra.html',
  styleUrls: ['./registrar-compra.css']
})
export class RegistrarCompra implements OnInit {
  compraForm: FormGroup;
  detalleForm: FormGroup;
  
  empleadoLogueado: any = null;
  proveedores: Proveedor[] = [];
  prendas: any[] = [];
  talles: any[] = [];
  
  detalles: DetalleConInfo[] = [];
  montoTotal = 0;

  constructor(
    private fb: FormBuilder,
    private comprasService: ComprasService,
    private proveedoresService: ProveedoresService,
    private stockService: StockService,
    private router: Router
  ) {
    this.compraForm = this.fb.group({
      proveedorId: ['', Validators.required]
    });

    this.detalleForm = this.fb.group({
      codigoPrenda: ['', Validators.required],
      talleId: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.cargarEmpleadoLogueado();
    this.cargarProveedores();
    this.cargarPrendas();
    this.cargarTalles();
  }

  cargarEmpleadoLogueado() {
    const empleadoStr = localStorage.getItem('empleado');
    if (empleadoStr) {
      this.empleadoLogueado = JSON.parse(empleadoStr);
    }
  }

  cargarProveedores() {
    this.proveedoresService.obtenerProveedores().subscribe({
      next: (response) => {
        this.proveedores = response.data || response;
      },
      error: (err) => {
        console.error('Error al cargar proveedores:', err);
        alert('Error al cargar proveedores');
      }
    });
  }

  cargarPrendas() {
    this.stockService.getPrendas().subscribe({
      next: (response: any) => {
        this.prendas = response; 
      },
      error: (err) => {
        console.error('Error al cargar prendas:', err);
      }
    });
  }

  cargarTalles() {
    // Asumiendo que tenés un servicio para talles
    // O podés usar los talles de una prenda específica
    this.stockService.getTalles().subscribe({
      next: (response: any) => {
        this.talles = response; 

      },
      error: (err) => {
        console.error('Error al cargar talles:', err);
      }
    });
  }

  agregarDetalle() {
    if (this.detalleForm.invalid) {
      this.detalleForm.markAllAsTouched();
      return;
    }

    const detalle: CreateDetalleCompraDto = {
      codigoPrenda: this.detalleForm.value.codigoPrenda,
      talleId: Number(this.detalleForm.value.talleId),
      cantidad: Number(this.detalleForm.value.cantidad),
      precioUnitario: Number(this.detalleForm.value.precioUnitario)
    };

    // Buscar info de la prenda para mostrar
    const prenda = this.prendas.find(p => p.codigo === detalle.codigoPrenda);
    const talle = this.talles.find(t => t.codigo === detalle.talleId);

     const detalleConInfo: DetalleConInfo = {  // <- TIPADO EXPLÍCITO
    ...detalle,
    descripcionPrenda: prenda?.descripcion || 'Desconocida',
    descripcionTalle: talle?.descripcion || 'Desconocido',
    subtotal: detalle.cantidad * detalle.precioUnitario
    };

    this.detalles.push(detalleConInfo as any);
    this.calcularTotal();
    this.detalleForm.reset({ cantidad: 1, precioUnitario: 0 });
  }

  eliminarDetalle(index: number) {
    this.detalles.splice(index, 1);
    this.calcularTotal();
  }

  calcularTotal() {
    this.montoTotal = this.detalles.reduce((sum, d) => sum + (d.cantidad * d.precioUnitario), 0);
  }

  guardarCompra() {
    if (this.compraForm.invalid || this.detalles.length === 0) {
      alert('Debe seleccionar un proveedor y agregar al menos un detalle');
      return;
    }

    if (!this.empleadoLogueado) {
      alert('No se detectó empleado logueado');
      return;
    }

    const compraData = {
      empleadoLegajo: Number(this.empleadoLogueado.legajo),
      proveedorId: Number(this.compraForm.value.proveedorId),
      detalles: this.detalles.map(d => ({
        codigoPrenda: d.codigoPrenda,
        talleId: d.talleId,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario
      }))
    };

    console.log('📦 Datos de compra:', compraData);

    this.comprasService.nuevaCompra(compraData).subscribe({
      next: (response) => {
        console.log('✅ Compra registrada:', response);
        alert('Compra registrada exitosamente');
        this.router.navigate(['/compras']);
      },
      error: (err) => {
        console.error('❌ Error al registrar compra:', err);
        alert(err.error?.message || 'Error al registrar la compra');
      }
    });
  }

  onPrendaChange(event: any) {
    const codigoPrenda = event.target.value;
    const prenda = this.prendas.find(p => p.codigo === codigoPrenda);
    
    if (prenda) {
      // Autocompletar precio unitario con el precio de venta (opcional)
      this.detalleForm.patchValue({
        precioUnitario: prenda.precio
      });
    }
  }
}
