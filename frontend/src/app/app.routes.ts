import { Routes } from '@angular/router';

import { Layout } from './layout/layout/layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Productos } from './pages/productos/productos';
import { Ventas } from './pages/ventas/ventas';
import { Inventario } from './pages/inventario/inventario';
import { Clientes } from './pages/clientes/clientes';
import { Proveedores } from './pages/proveedores/proveedores';
import { Usuarios } from './pages/usuarios/usuarios';
import { Factura } from './pages/factura/factura';
import { Login } from './pages/login/login';

import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { Categorias } from './pages/categoria/categoria';
import { Setup } from './setup/setup';
import { ReporteVentas } from './pages/reporte-ventas/reporte-ventas';

export const routes: Routes = [
  {
  path: 'setup',
  component: Setup
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'factura/:id',
    component: Factura
  },
  {
  path: 'reporte-ventas',
  component: ReporteVentas,
  canActivate: [authGuard]
},
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: Dashboard
      },
      {
        path: 'productos',
        component: Productos
      },
      {
        path: 'ventas',
        component: Ventas
      },
      {
        path: 'inventario',
        component: Inventario
      },
      {
        path: 'clientes',
        component: Clientes
      },
      {
        path: 'proveedores',
        component: Proveedores
      },
      {
        path: 'usuarios',
        component: Usuarios,
        canActivate: [adminGuard]
      },
      {
        path: 'categorias',
        component: Categorias
      }
    ]
  }
];