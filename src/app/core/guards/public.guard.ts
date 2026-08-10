import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HttpAuth } from '../services/http-auth';

export const publicGuard: CanActivateFn = (route, state) => {
  const httpAuth = inject(HttpAuth);
  const router = inject(Router);

  if (httpAuth.isLoggedIn()) {
    // Si ya está autenticado, redirigir al dashboard
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
