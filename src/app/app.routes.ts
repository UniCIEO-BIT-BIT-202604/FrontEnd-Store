import { Routes } from '@angular/router';

import { Home } from './features/home/home';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { guestGuard } from './core/guards/guest.guard';
import { ROLES } from './core/constants/global.config';

export const routes: Routes = [
  // =========================================================================
  // 1. RUTAS PÚBLICAS (No Autenticados - guestGuard)
  // =========================================================================
  { path: 'home', component: Home },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login')
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register/register')
  },
  {
    path: '404',
    loadComponent: () => import('./features/page-not-found/page-not-found')
  },

  // =========================================================================
  // 2. DASHBOARD Y RUTAS HIJAS PROTEGIDAS (Padre protegido con authGuard)
  // =========================================================================
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard'),
    children: [
      // ---------------------------------------------------------------------
      // RUTAS HIJAS DE USUARIOS (Acceso reservado a SUPER_ADMIN y ADMIN)
      // ---------------------------------------------------------------------
      {
        path: 'user/list',
        canActivate: [roleGuard],
        data: { roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN] },
        loadComponent: () => import('./features/users/user-list/user-list')
      },
      {
        path: 'user/new',
        canActivate: [roleGuard],
        data: { roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN] },
        loadComponent: () => import('./features/users/user-new-form/user-new-form')
      },
      {
        path: 'user/edit/:id',
        canActivate: [roleGuard],
        data: { roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN] },
        loadComponent: () => import('./features/users/user-edit-form/user-edit-form')
      },

      // ---------------------------------------------------------------------
      // RUTAS HIJAS DE CATEGORÍAS (SUPER_ADMIN, ADMIN y EDITOR)
      // ---------------------------------------------------------------------
      {
        path: 'category/list',
        canActivate: [roleGuard],
        data: { roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EDITOR] },
        loadComponent: () => import('./features/categories/category-list/category-list')
      },
      {
        path: 'category/new',
        canActivate: [roleGuard],
        data: { roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EDITOR] },
        loadComponent: () => import('./features/categories/category-new-form/category-new-form')
      },
      {
        path: 'category/edit/:id',
        canActivate: [roleGuard],
        data: { roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EDITOR] },
        loadComponent: () => import('./features/categories/category-edit-form/category-edit-form')
      },

      // ---------------------------------------------------------------------
      // RUTAS HIJAS DE PRODUCTOS (SUPER_ADMIN, ADMIN y EDITOR)
      // ---------------------------------------------------------------------
      {
        path: 'product/list',
        canActivate: [roleGuard],
        data: { roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EDITOR] },
        loadComponent: () => import('./features/products/product-list/product-list')
      },
      {
        path: 'product/new',
        canActivate: [roleGuard],
        data: { roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EDITOR] },
        loadComponent: () => import('./features/products/product-new-form/product-new-form')
      },
      {
        path: 'product/edit/:id',
        canActivate: [roleGuard],
        data: { roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EDITOR] },
        loadComponent: () => import('./features/products/product-edit-form/product-edit-form')
      }
    ]
  },

  // =========================================================================
  // 3. REDIRECCIONES Y COMODINES
  // =========================================================================
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: '404', pathMatch: 'full' }
];
