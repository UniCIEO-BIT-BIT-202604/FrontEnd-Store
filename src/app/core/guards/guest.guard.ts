import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { HttpAuth } from '../services/http-auth';

/**
 * Guard de Invitados / No Autenticados (guestGuard).
 * 
 * Evita que usuarios que YA están autenticados accedan a rutas públicas de autenticación
 * como '/login' o '/register'.
 * 
 * Flujo de ejecución:
 * 1. Invoca authService.checkAuthStatus() para verificar la sesión contra el Backend.
 * 2. Si el usuario YA inició sesión:
 *    - Muestra un mensaje informativo en la consola.
 *    - Redirige automáticamente a '/dashboard'.
 *    - Retorna `false` para bloquear el acceso a la vista pública.
 * 3. Si el usuario NO está autenticado:
 *    - Retorna `true`, permitiéndole acceder normalmente a /login o /register.
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(HttpAuth);
  const router = inject(Router);

  return authService.checkAuthStatus().pipe(
    map((isAuthenticated) => !isAuthenticated), // Invertimos la condición: solo permite paso si NO está autenticado
    tap((isGuest) => {
      if (!isGuest) {
        console.info('ℹ️ [GuestGuard] El usuario ya cuenta con una sesión activa. Redirigiendo a /dashboard...');
        router.navigate(['/dashboard']);
      }
    })
  );
};
