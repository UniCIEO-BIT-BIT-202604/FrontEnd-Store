import { Routes } from '@angular/router';

import { Home } from './features/home/home';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

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
  // 2. DASHBOARD PRINCIPAL (Acceso para cualquier usuario autenticado)
  // =========================================================================
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard')
  },

  // =========================================================================
  // =========================================================================
  // 3. RUTAS DE USUARIOS (Acceso reservado a SUPER_ADMIN y ADMIN)
  // Backend: authorizationUser([ROLES.SUPER_ADMIN, ROLES.ADMIN])
  // =========================================================================
  {
    path: 'dashboard/user/list',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['super administrator', 'administrator', 'super_admin', 'admin'] },
    loadComponent: () => import('./features/users/user-list/user-list')
  },
  {
    path: 'dashboard/user/new',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['super administrator', 'administrator', 'super_admin', 'admin'] },
    loadComponent: () => import('./features/users/user-new-form/user-new-form')
  },
  {
    path: 'dashboard/user/edit/:id',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['super administrator', 'administrator', 'super_admin', 'admin'] },
    loadComponent: () => import('./features/users/user-edit-form/user-edit-form')
  },

  // =========================================================================
  // 4. RUTAS DE CATEGORÍAS (Acceso para SUPER_ADMIN, ADMIN y EDITOR)
  // Backend: authorizationUser([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EDITOR])
  // =========================================================================
  {
    path: 'dashboard/category/list',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['super administrator', 'administrator', 'editor', 'super_admin', 'admin'] },
    loadComponent: () => import('./features/categories/category-list/category-list')
  },
  {
    path: 'dashboard/category/new',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['super administrator', 'administrator', 'editor', 'super_admin', 'admin'] },
    loadComponent: () => import('./features/categories/category-new-form/category-new-form')
  },
  {
    path: 'dashboard/category/edit/:id',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['super administrator', 'administrator', 'editor', 'super_admin', 'admin'] },
    loadComponent: () => import('./features/categories/category-edit-form/category-edit-form')
  },

  // =========================================================================
  // 5. RUTAS DE PRODUCTOS (Acceso para SUPER_ADMIN, ADMIN y EDITOR)
  // Backend: authorizationUser([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EDITOR])
  // =========================================================================
  {
    path: 'dashboard/product/list',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['super administrator', 'administrator', 'editor', 'super_admin', 'admin'] },
    loadComponent: () => import('./features/products/product-list/product-list')
  },
  {
    path: 'dashboard/product/new',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['super administrator', 'administrator', 'editor', 'super_admin', 'admin'] },
    loadComponent: () => import('./features/products/product-new-form/product-new-form')
  },
  {
    path: 'dashboard/product/edit/:id',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['super administrator', 'administrator', 'editor', 'super_admin', 'admin'] },
    loadComponent: () => import('./features/products/product-edit-form/product-edit-form')
  },

  // =========================================================================
  // 6. REDIRECCIONES Y COMODINES (Siempre al final)
  // =========================================================================
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: '404', pathMatch: 'full' }
];
