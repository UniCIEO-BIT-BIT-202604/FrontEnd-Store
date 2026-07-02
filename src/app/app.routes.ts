import { Routes } from '@angular/router';

import { Home } from './features/home/home';
import PageNotFound from './features/page-not-found/page-not-found';
import { UserNewForm } from './features/users/user-new-form/user-new-form';


export const routes: Routes = [
  // Paths
  // Esta ruta carga por defecto el componente asociado a la ruta
  { path: 'home', component: Home },
  // Rutas con LazyLoad (Carga Perezosa)
  {
    path: 'user-new',
    loadComponent: () => import( './features/users/user-new-form/user-new-form' ).then( m => m.UserNewForm)
  },
  {
    path: 'user/list',
    loadComponent: () => import( './features/users/user-list/user-list' ).then( m => m.UserList)
  },
  // Para importar la ruta sin resolver la Promesa usando then/catch, se debe poner exportar la clase como default (ver PageNotFound.ts)
  {
    path: '404',
    loadComponent: () => import( './features/page-not-found/page-not-found')
  },
  // Redirections
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: '404', pathMatch: 'full' }
];
