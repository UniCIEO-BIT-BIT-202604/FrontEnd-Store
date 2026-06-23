import { Routes } from '@angular/router';

import { Home } from './features/home/home';
import PageNotFound from './features/page-not-found/page-not-found';


export const routes: Routes = [
  // Paths
  // Esta ruta carga por defecto el componente asociado a la ruta
  { path: 'home', component: Home },
  // Rutas con LazyLoad (Carga Perezosa)
  {
    path: 'brochure',
    loadComponent: () => import( './features/brochure/brochure' ).then( m => m.Brochure )
  },
  {
    path: 'about-us',
    loadComponent: () => import( './features/about-us/about-us' ).then( m => m.AboutUs )
  },
  {
    path: 'contact',
    loadComponent: () => import( './features/contact/contact' ).then( m => m.Contact )
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
