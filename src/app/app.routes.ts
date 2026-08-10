import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Ruta principal por defecto
  { path: 'home', component: Home },

  // --- Autenticación (Solo accesibles para no autenticados) ---
  {
    path: 'login',
    canActivate: [publicGuard],
    loadComponent: () => import('./features/auth/login/login')
  },
  {
    path: 'register',
    canActivate: [publicGuard],
    loadComponent: () => import('./features/auth/register/register')
  },

  // --- Dashboard Base (Protegido con authGuard) ---
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard')
  },

  // --- Usuarios (Protegidos con authGuard y opcionalmente roleGuard) ---
  {
    path: 'dashboard/users',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN_ROLE'] },
    loadComponent: () => import('./features/users/user-list/user-list')
  },
  {
    path: 'dashboard/user/new',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN_ROLE'] },
    loadComponent: () => import('./features/users/user-new-form/user-new-form')
  },
  {
    path: 'dashboard/user/edit/:id',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN_ROLE'] },
    loadComponent: () => import('./features/users/user-edit-form/user-edit-form')
  },

  // --- Categorías ---
  {
    path: 'dashboard/categories',
    canActivate: [authGuard],
    loadComponent: () => import('./features/categories/category-list/category-list')
  },
  {
    path: 'dashboard/category/new',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN_ROLE'] },
    loadComponent: () => import('./features/categories/category-new-form/category-new-form')
  },
  {
    path: 'dashboard/category/edit/:id',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN_ROLE'] },
    loadComponent: () => import('./features/categories/category-edit-form/category-edit-form')
  },

  // --- Productos ---
  {
    path: 'dashboard/products',
    canActivate: [authGuard],
    loadComponent: () => import('./features/products/product-list/product-list')
  },
  {
    path: 'dashboard/product/new',
    canActivate: [authGuard],
    loadComponent: () => import('./features/products/product-new-form/product-new-form')
  },
  {
    path: 'dashboard/product/edit/:id',
    canActivate: [authGuard],
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
