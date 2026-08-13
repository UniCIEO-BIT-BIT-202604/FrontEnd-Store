import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HttpAuth } from '../services/http-auth';

/**
 * Guard de Autorización por Roles (roleGuard).
 * 
 * Filtra el acceso a las rutas en función del rol del usuario autenticado.
 * 
 * Se aplica en la configuración de las rutas agregando `data: { roles: ['administrator', 'super administrator'] }`:
 * e.g. `{ path: 'dashboard/user/list', canActivate: [authGuard, roleGuard], data: { roles: ['administrator', 'super administrator'] } }`
 * 
 * Flujo de ejecución:
 * 1. Lee los roles autorizados definidos en `route.data['roles']`.
 * 2. Si la ruta no define roles específicos, permite el paso (`true`).
 * 3. Lee el usuario autenticado desde el servicio `HttpAuth`.
 * 4. Si el rol del usuario coincide con alguno de los roles autorizados, concede el acceso (`true`).
 * 5. Si no coincide, notifica en consola, redirige a '/dashboard' y bloquea el acceso (`false`).
 */
export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(HttpAuth);
  const router = inject(Router);

  const allowedRoles: string[] = route.data?.['roles'] || [];

  // Si la ruta no restringe roles, permitimos el acceso
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  const currentUser = authService.user;
  // Extraemos el nombre del rol (compatible si viene como objeto o string)
  const userRole = typeof currentUser?.role === 'object' ? currentUser?.role?.name : currentUser?.role;

  // Verificamos si el rol del usuario está dentro de los roles autorizados para esta ruta
  const isAuthorized = userRole && allowedRoles.some(
    (role) => role.toLowerCase() === String(userRole).toLowerCase()
  );

  if (isAuthorized) {
    return true;
  }

  console.warn(`⛔ [RoleGuard] Acceso denegado a '${state.url}'. El rol '${userRole}' no cuenta con permisos. Roles autorizados:`, allowedRoles);

  // Redirigir al dashboard si no tiene permisos
  router.navigate(['/dashboard']);
  return false;
};
