import { Routes } from '@angular/router';

import { Home } from './features/home/home';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  // 1. Redirección inicial por defecto (Root Path)
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  // 2. Rutas Públicas (Estáticas y Lazy Loaded)
  {
    path: 'home',
    component: Home
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart')
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout')
  },
  // 3. Rutas de Autenticación (Estáticas y Lazy Loaded)
  {
    path: '',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login')
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register')
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/forgot-password/forgot-password')
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./features/auth/reset-password/reset-password')
      }
    ]
  },

  // 4. Rutas Protegidas (Dashboard y sus Subrutas)
  // Las subrutas heredan la autenticación de canActivate del padre
  {
    path: 'dashboard',
    // canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard'),
    children: [
      {
        path: 'orders',
        loadComponent: () => import('./features/orders/orders')
      },

      // Rutas de Usuario (Rutas estáticas antes que dinámicas con parámetros)
      {
        path: 'user/list',
        loadComponent: () => import('./features/users/user-list/user-list')
      },
      {
        path: 'user/new',
        loadComponent: () => import('./features/users/user-new-form/user-new-form')
      },
      {
        path: 'user/edit/:id',
        loadComponent: () => import('./features/users/user-edit-form/user-edit-form')
      },

      // Rutas de Categoría (Rutas estáticas antes que dinámicas con parámetros)
      {
        path: 'category/list',
        loadComponent: () => import('./features/categories/category-list/category-list')
      },
      {
        path: 'category/new',
        loadComponent: () => import('./features/categories/category-new-form/category-new-form')
      },
      {
        path: 'category/edit/:id',
        loadComponent: () => import('./features/categories/category-edit-form/category-edit-form')
      },

      // Rutas de Producto (Rutas estáticas antes que dinámicas con parámetros)
      {
        path: 'product/list',
        loadComponent: () => import('./features/products/product-list/product-list')
      },
      {
        path: 'product/new',
        loadComponent: () => import('./features/products/product-new-form/product-new-form')
      },
      {
        path: 'product/edit/:id',
        loadComponent: () => import('./features/products/product-edit-form/product-edit-form')
      }
    ]
  },

  // 5. Rutas de Error 
  {
    path: '404',
    loadComponent: () => import('./features/page-not-found/page-not-found')
  },
  // 6. Wildcard - Captura todas las rutas que no coincidan con ninguna de las anteriores (first-match-wins)
  {
    path: '**',
    redirectTo: '404',
    pathMatch: 'full'
  }
];

