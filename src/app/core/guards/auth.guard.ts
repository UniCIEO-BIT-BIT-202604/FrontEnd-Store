import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { tap } from 'rxjs';
import { HttpAuth } from '../services/http-auth';

/**
 * Guard de Autenticación (authGuard).
 * 
 * Protege las rutas privadas de la aplicación verificando y renovando el Token de acceso contra el Backend.
 * 
 * Flujo de funcionamiento:
 * 1. Ejecuta authService.checkAuthStatus(), el cual solicita GET '/auth/renew-token' al Backend.
 * 2. Si el token es válido y se renueva correctamente, permite la navegación (retorna true).
 * 3. Si el token expiró, es inválido o no existe, limpia la sesión, redirige a '/login' y bloquea la ruta (retorna false).
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(HttpAuth);
  const router = inject(Router);

  return authService.checkAuthStatus().pipe(
    tap((isAuthenticated) => {
      if (!isAuthenticated) {
        console.warn('🔒 [AuthGuard] Acceso bloqueado. Sesión expirada o token inválido. Redirigiendo a /login...');
        router.navigate(['/login']);
      }
    })
  );
};
