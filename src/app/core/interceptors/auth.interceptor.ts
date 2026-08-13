import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpAuth } from '../services/http-auth';

/**
 * Interceptor HTTP de Autenticación.
 * 
 * Se encarga de obtener el Token del servicio `HttpAuth` (mediante su getter `token`)
 * e inyectar la cabecera `Authorization: Bearer <token>` en todas las peticiones HTTP salientes.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(HttpAuth);
  const token = authService.token;

  console.group('2️⃣ [AuthInterceptor] Clonación de petición e inyección de Token');
  console.log('💡 En este punto se ejecuta req.clone() para adjuntar las cabeceras de autenticación sin mutar la petición original.');

  if (token) {
    // =========================================================================
    // OPCIÓN 1 (Comentada): Cabecera estándar 'Authorization: Bearer <token>'
    // =========================================================================
    // const authReq = req.clone({
    //   setHeaders: {
    //     Authorization: `Bearer ${token}`,
    //     'X-Procesado-Por': 'AuthInterceptor'
    //   }
    // });

    // =========================================================================
    // OPCIÓN 2 (HABILITADA): Header personalizado 'x-token' + 'X-Procesado-Por'
    // =========================================================================
    const authReq = req.clone({
      setHeaders: {
        'x-token': token,
        'X-Procesado-Por': 'AuthInterceptor'
      }
    });

    // =========================================================================
    // OPCIÓN 3 (Comentada): Header personalizado 'access-token' + 'X-Procesado-Por'
    // =========================================================================
    // const authReq = req.clone({
    //   setHeaders: {
    //     'access-token': token,
    //     'X-Procesado-Por': 'AuthInterceptor'
    //   }
    // });

    // =========================================================================
    // OPCIÓN 4 (Comentada): Enviar MÚLTIPLES cabeceras al mismo tiempo
    // =========================================================================
    // const authReq = req.clone({
    //   setHeaders: {
    //     Authorization: `Bearer ${token}`,
    //     'x-token': token,
    //     'X-Procesado-Por': 'AuthInterceptor'
    //   }
    // });

    console.log('✅ Petición clonada con éxito. Cabeceras inyectadas.');
    console.groupEnd();

    return next(authReq);
  }

  console.log('⚠️ No hay token disponible. Se envía la petición sin clonar.');
  console.groupEnd();

  return next(req);
};
