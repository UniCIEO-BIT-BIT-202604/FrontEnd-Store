import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HttpAuth } from '../services/http-auth';

export const authGuard: CanActivateFn = (route, state) => {
  const httpAuth = inject(HttpAuth);
  const router = inject(Router);

  if (httpAuth.isLoggedIn()) {
    return true;
  }

  // Redirigir a login si no está autenticado
  router.navigate(['/login']);
  return false;
};
