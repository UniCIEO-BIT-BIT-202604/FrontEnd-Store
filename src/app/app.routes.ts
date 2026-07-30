import { Routes } from '@angular/router';
import { Home } from './features/home/home';

export const routes: Routes = [
  // Ruta principal por defecto
  { path: 'home', component: Home },

  // --- Autenticación ---
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login')
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register')
  },

  // --- Dashboard Base ---
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard')
  },

  // --- Usuarios ---
  {
    path: 'dashboard/users',
    loadComponent: () => import('./features/users/user-list/user-list')
  },
  {
    path: 'dashboard/user/new',
    loadComponent: () => import('./features/users/user-new-form/user-new-form')
  },
  {
    path: 'dashboard/user/edit/:id',
    loadComponent: () => import('./features/users/user-edit-form/user-edit-form')
  },

  // --- Categorías ---
  {
    path: 'dashboard/categories',
    loadComponent: () => import('./features/categories/category-list/category-list')
  },
  {
    path: 'dashboard/category/new',
    loadComponent: () => import('./features/categories/category-new-form/category-new-form')
  },
  {
    path: 'dashboard/category/edit/:id',
    loadComponent: () => import('./features/categories/category-edit-form/category-edit-form')
  },

  // --- Productos ---
  {
    path: 'dashboard/products',
    loadComponent: () => import('./features/products/product-list/product-list')
  },
  {
    path: 'dashboard/product/new',
    loadComponent: () => import('./features/products/product-new-form/product-new-form')
  },
  {
    path: 'dashboard/product/edit/:id',
    loadComponent: () => import('./features/products/product-list/product-list')
  },

  // --- Páginas de Error y Redirecciones ---
  {
    path: '404',
    loadComponent: () => import('./features/page-not-found/page-not-found')
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: '404', pathMatch: 'full' }
];

