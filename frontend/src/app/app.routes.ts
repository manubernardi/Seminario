import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Stock } from './pages/stock/stock'
import { Ventas } from './pages/ventas/ventas'
import { VerCompras } from './pages/ver-compras/ver-compras';
import { RegistrarCompra } from './pages/registrar-compra/registrar-compra';
import { RegistrarVenta } from './pages/registrar-venta/registrar-venta';
import { Clientes } from './pages/clientes/clientes';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: 'login', component: Login },
    { path: 'home', component: Home },
    { path: 'register', component: Register },
    {path: 'stock', component: Stock},
    {path: 'ventas', component: Ventas},
    {path: 'ver-compras', component: VerCompras},
    {path: 'registrar-compra', component: RegistrarCompra},
    {path: 'registrar-venta', component: RegistrarVenta},
    {path: 'clientes', component: Clientes}
];

