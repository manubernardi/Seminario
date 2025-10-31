import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // Ajusta la ruta según tu estructura
import { Login } from '../app/pages/login/login';
import { Home } from '../app/pages/home/home';
import { Register } from '../app/pages/register/register';
import { Stock } from '../app/pages/stock/stock';
import { Ventas } from '../app/pages/ventas/ventas';
import { VerCompras } from '../app/pages/ver-compras/ver-compras';
import { RegistrarCompra } from '../app/pages/registrar-compra/registrar-compra';
import { RegistrarVenta } from '../app/pages/registrar-venta/registrar-venta';
import { Clientes } from '../app/pages/clientes/clientes';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  
  // 👇 TODAS estas rutas ahora están protegidas
  { 
    path: 'home', 
    component: Home,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  { 
    path: 'stock', 
    component: Stock,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  { 
    path: 'ventas', 
    component: Ventas,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  { 
    path: 'ver-compras', 
    component: VerCompras,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  { 
    path: 'registrar-compra', 
    component: RegistrarCompra,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  { 
    path: 'registrar-venta', 
    component: RegistrarVenta,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  { 
    path: 'clientes', 
    component: Clientes,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  { 
    path: 'registrar-compras', 
    component: Clientes,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  }
];