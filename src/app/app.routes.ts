import { Routes } from '@angular/router';

import { Home } from './features/home/home';

export const routes: Routes = [
  // Paths
  // Esta ruta carga por defecto el componente asociado a la ruta
  { path: 'home', component: Home },
  // Rutas con LazyLoad (Carga Perezosa)
  // Para importar la ruta sin resolver la Promesa usando then/catch, se debe poner exportar la clase como default (ver PageNotFound.ts)
  {
    path: '404',
    loadComponent: () => import( './features/page-not-found/page-not-found')
  },
  {
    path: 'user/new',
    loadComponent: () => import( './features/users/user-new-form/user-new-form' )
  },
  {
    path: 'user/edit/:id',
    loadComponent: () => import( './features/users/user-edit-form/user-edit-form')
  },
  {
    path: 'user/list',
    loadComponent: () => import( './features/users/user-list/user-list' )
  },
  {
    path: 'category/new',
    loadComponent: () => import( './features/categories/category-new-form/category-new-form')
  },
  {
    path: 'category/edit',
    loadComponent: () => import( './features/categories/category-edit-form/category-edit-form' )
  },
  {
    path: 'category/list',
    loadComponent: () => import( './features/categories/category-list/category-list' )
  },
  {
    path: 'product/new',
    loadComponent: () => import( './features/products/product-new-form/product-new-form' )
  },
  {
    path: 'product/edit/:id',
    loadComponent: () => import( './features/products/product-edit-form/product-edit-form' )
  },
  {
    path: 'product/list',
    loadComponent: () => import( './features/products/product-list/product-list' )
  },
  // Redirections
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: '404', pathMatch: 'full' }
];
