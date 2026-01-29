// nueva-compra.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ComprasService, CreateDetalleCompraDto } from '../../services/compras.service';
import { ProveedoresService, Proveedor } from '../../services/proveedores.service';
import { StockService } from '../../services/stock.service';
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
export interface DetalleCompra {
  codigoPrenda: string;
  descripcionPrenda: string;
  talleId: number;
  descripcionTalle: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}
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
  prendas: Prenda[] = [];
  prendaXTalles: PrendaXTalle[] = [];
  prendasFiltradas: Prenda[] = [];
  talles: Talle[] = [];
  searchTerm: string = '';
  prendaForm: FormGroup;
  prendasXTallesForm: FormGroup[] = [];
  modoEdicion = false;
  empleadoLogueado: any = null;
  proveedores: Proveedor[] = [];
  
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
      this.prendaForm = this.fb.group({
      codigo: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0.01)]],
    });
    this.prendasXTallesForm = this.talles.map(talle =>
    this.fb.group({
      talle_id: [talle.codigo, Validators.required],
      cantidad: [0, [Validators.required, Validators.min(0)]]
    })
  );    
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
          this.prendasXTallesForm = this.talles.map(t =>
          this.fb.group({
            cantidad: [0]
          })
        );

        console.log('Talles cargados:', this.talles);

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
        this.router.navigate(['/ver-compras']);
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

  
guardarPrenda() {

  if (this.prendaForm.invalid) return;

  const prenda = {
    codigo: this.prendaForm.value.codigo,
    descripcion: this.prendaForm.value.descripcion,
    precio: this.prendaForm.value.precio,
    prendasXTalles: this.prendasXTallesForm.map((f, i) => ({
      talle_id: this.talles[i].codigo,
      cantidad: f.value.cantidad,
      prenda_codigo: this.prendaForm.value.codigo
    }))
  };

  this.stockService.crearPrenda(prenda).subscribe(resp => {

    // 🔥 agregar al selector
    this.prendas.push(resp);

    // 🔥 agregar al resumen
    this.agregarNuevaPrendaAlResumen(resp);

    this.prendaForm.reset();
  });
}
  
  getTalleDescripcion(codigo: number): string {
    console.log("Buscando talle para código:", codigo);
    if (codigo == null) { 
      return 'Desconocido';
    }
    const talle = this.talles.find(t => t.codigo === codigo);
    console.log("Talle encontrado:", talle);
    return talle ? talle.descripcion : 'Desconocido';
  }

  ordenarTalles(prendasXTalles: PrendaXTalle[]): PrendaXTalle[] {
    if (!prendasXTalles) return [];
    return prendasXTalles.sort((a, b) => {
      return a.talle_id - b.talle_id;
    });
  }
agregarNuevaPrendaAlResumen(prenda: Prenda) {

  prenda.prendasXTalles.forEach((pt: PrendaXTalle) => {

    if (pt.cantidad > 0) {

      const talle = this.talles.find(t => t.codigo == pt.talle_id);


      if (talle) {
        const detalle: DetalleCompra = {
          codigoPrenda: prenda.codigo,
          descripcionPrenda: prenda.descripcion,
          talleId: talle.codigo,
          descripcionTalle: talle.descripcion,
          cantidad: pt.cantidad,
          precioUnitario: prenda.precio,
          subtotal: pt.cantidad * prenda.precio
        };

        this.detalles.push(detalle);
      }
    }
  });

  this.calcularTotal();
}

  
}
