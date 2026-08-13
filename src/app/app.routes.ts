import { Routes } from '@angular/router';

import { Home } from './features/home/home';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // =========================================================================
  // 1. RUTAS PÚBLICAS Y PRINCIPALES
  // =========================================================================
  { path: 'home', component: Home },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login')
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register')
  },
  {
    path: '404',
    loadComponent: () => import('./features/page-not-found/page-not-found')
  },

  // =========================================================================
  // 2. DASHBOARD (RUTA PRIVADA PRINCIPAL)
  // =========================================================================
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard')
  },

  // =========================================================================
  // 3. RUTAS DE USUARIOS (Primero estáticas: list, new | Luego dinámicas: edit/:id)
  // =========================================================================
  {
    path: 'user/list',
    canActivate: [authGuard],
    loadComponent: () => import('./features/users/user-list/user-list')
  },
  {
    path: 'dashboard/user/list',
    canActivate: [authGuard],
    loadComponent: () => import('./features/users/user-list/user-list')
  },
  {
    path: 'user/new',
    canActivate: [authGuard],
    loadComponent: () => import('./features/users/user-new-form/user-new-form')
  },
  {
    path: 'dashboard/user/new',
    canActivate: [authGuard],
    loadComponent: () => import('./features/users/user-new-form/user-new-form')
  },
  {
    path: 'user/edit/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/users/user-edit-form/user-edit-form')
  },
  {
    path: 'dashboard/user/edit/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/users/user-edit-form/user-edit-form')
  },

  // =========================================================================
  // 4. RUTAS DE CATEGORÍAS (Primero estáticas: list, new | Luego dinámicas: edit/:id)
  // =========================================================================
  {
    path: 'category/list',
    canActivate: [authGuard],
    loadComponent: () => import('./features/categories/category-list/category-list')
  },
  {
    path: 'dashboard/category/list',
    canActivate: [authGuard],
    loadComponent: () => import('./features/categories/category-list/category-list')
  },
  {
    path: 'category/new',
    canActivate: [authGuard],
    loadComponent: () => import('./features/categories/category-new-form/category-new-form')
  },
  {
    path: 'dashboard/category/new',
    canActivate: [authGuard],
    loadComponent: () => import('./features/categories/category-new-form/category-new-form')
  },
  {
    path: 'category/edit/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/categories/category-edit-form/category-edit-form')
  },
  {
    path: 'dashboard/category/edit/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/categories/category-edit-form/category-edit-form')
  },

  // =========================================================================
  // 5. RUTAS DE PRODUCTOS (Primero estáticas: list, new | Luego dinámicas: edit/:id)
  // =========================================================================
  {
    path: 'product/list',
    canActivate: [authGuard],
    loadComponent: () => import('./features/products/product-list/product-list')
  },
  {
    path: 'dashboard/product/list',
    canActivate: [authGuard],
    loadComponent: () => import('./features/products/product-list/product-list')
  },
  {
    path: 'product/new',
    canActivate: [authGuard],
    loadComponent: () => import('./features/products/product-new-form/product-new-form')
  },
  {
    path: 'dashboard/product/new',
    canActivate: [authGuard],
    loadComponent: () => import('./features/products/product-new-form/product-new-form')
  },
  {
    path: 'product/edit/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/products/product-edit-form/product-edit-form')
  },
  {
    path: 'dashboard/product/edit/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/products/product-edit-form/product-edit-form')
  },

  // =========================================================================
  // 6. REDIRECCIONES Y COMODINES (Siempre al final)
  // =========================================================================
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: '404', pathMatch: 'full' }
];
