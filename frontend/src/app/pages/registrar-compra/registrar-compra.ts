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
  tipoPrenda?: TipoPrenda
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
interface TipoPrenda {
  id: number;
  nombre: string;
  talles: Talle[];
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

  tiposPrenda: TipoPrenda[] = [];
  tallesOriginales: Talle[] = [];
  tallesDelTipo: Talle[] = []; // talles que muestra según el tipo elegido
  tallesFiltradosReponer: Talle[] = [];

  // ── Toggle tipo de compra ──────────────────────────────────────────────────
  mostrarReponer = false;
  mostrarNuevo = false;
  // ──────────────────────────────────────────────────────────────────────────

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
      tipoPrendaId: ['', Validators.required],
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
    this.cargarTiposPrenda();
    
    
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
    this.stockService.getTalles().subscribe({
    next: (response: any) => {
      this.tallesOriginales = response;
      this.talles = response; // Por si lo usás en otro lado
      this.tallesFiltradosReponer = []; // Empieza vacío hasta elegir prenda
    },
    error: (err) => console.error('Error al cargar talles:', err)
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

    const prenda = this.prendas.find(p => p.codigo === detalle.codigoPrenda);
    const talle = this.talles.find(t => t.codigo === detalle.talleId);

     const detalleConInfo: DetalleConInfo = {
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

  console.log('Prenda seleccionada:', prenda); // <--- MIRÁ ESTO EN LA CONSOLA (F12)
  console.log('Talles disponibles en esta prenda:', prenda?.prendasXTalles);
  
  if (prenda) {
    this.detalleForm.patchValue({ precioUnitario: prenda.precio });
    
    if (prenda.tipoPrenda && prenda.tipoPrenda.talles) {
      this.tallesFiltradosReponer = prenda.tipoPrenda.talles;
    } else {
      // Si por alguna razón no vino el tipo, usamos los originales como fallback
      this.tallesFiltradosReponer = this.tallesOriginales;
    }
  } else {
    this.tallesFiltradosReponer = [];
  }

  this.detalleForm.get('talleId')?.setValue(''); 
}

  
guardarPrenda() {

  if (this.prendaForm.invalid) return;

   const prenda = {
    codigo: this.prendaForm.value.codigo,
    descripcion: this.prendaForm.value.descripcion,
    precio: this.prendaForm.value.precio,
    tipoPrendaId: Number(this.prendaForm.value.tipoPrendaId),
  };

  this.stockService.crearPrenda(prenda).subscribe(resp => {
    // Ahora armamos los detalles con las cantidades ingresadas
    const prendaConCantidades = {
      ...resp,
      prendasXTalles: this.tallesDelTipo.map((t, i) => ({
        talle_id: t.codigo,
        cantidad: this.prendasXTallesForm[i].value.cantidad
      }))
    };
    this.prendas.push(prendaConCantidades);
    this.agregarNuevaPrendaAlResumen(prendaConCantidades);
    this.prendaForm.reset();
    this.tallesDelTipo = [];
    this.prendasXTallesForm = [];
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

cargarTiposPrenda() {
  this.stockService.getTiposPrenda().subscribe({
    next: (response: any) => {
      this.tiposPrenda = response;
    },
    error: (err) => console.error('Error al cargar tipos de prenda:', err)
  });
}

onTipoChange(event: any) {
  const id = Number(event.target.value);
  const tipo = this.tiposPrenda.find(t => t.id === id);
  this.tallesDelTipo = tipo ? tipo.talles : [];

  // Regenerar formularios de cantidad por talle
  this.prendasXTallesForm = this.tallesDelTipo.map(() =>
    this.fb.group({ cantidad: [0, [Validators.required, Validators.min(0)]] })
  );
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