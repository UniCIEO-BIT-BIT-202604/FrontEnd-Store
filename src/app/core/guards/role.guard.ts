import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HttpAuth } from '../services/http-auth';

export const roleGuard: CanActivateFn = (route, state) => {
  const httpAuth = inject(HttpAuth);
  const router = inject(Router);

  const user = httpAuth.user;
  const allowedRoles = route.data?.['roles'] as Array<string> | undefined;

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  // Si no se definen roles requeridos en la ruta, se permite la entrada
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  // Verificar si el rol del usuario coincide con alguno de los roles autorizados
  const hasRole = allowedRoles.includes(user.role);

  if (hasRole) {
    return true;
  }

  // Si no tiene el rol permitido, redirigir a dashboard o página no autorizada
  console.warn(`[RoleGuard] Acceso denegado. Rol '${user.role}' no autorizado para la ruta '${state.url}'.`);
  router.navigate(['/dashboard']);
  return false;
};
