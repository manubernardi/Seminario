import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Stock } from './pages/stock/stock'
import { Ventas } from './pages/ventas/ventas'

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: 'login', component: Login },
    { path: 'home', component: Home },
    { path: 'register', component: Register },
    {path: 'stock', component: Stock},
    {path: 'ventas', component: Ventas},
];

