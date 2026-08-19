import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { HttpAuth } from '../services/http-auth';
import { inject } from '@angular/core';

import { catchError, of, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const httpAuth = inject(HttpAuth);
  const router = inject(Router);

  // (1) Obtener el token
  const token = httpAuth.token;
  // console.log( 'token: ', token );

  let requestHeadersToken = req;

  // Validamos si el token existe
  if (token) {
    // (2) Creamos el Header (Cabecera) y agregamos el token en la propiedad "X/Token"
    requestHeadersToken = req.clone({
      headers: req.headers
        .set('X-Token', token)                      // Estamos enviando el token en una cabecera HTTP
        .set('X-Procesado-por', 'authInterceptor')  // Para reconocer quien esta creando la Cabecera
    });
  }

  // (3) Envia la cabecera con o sin token al siguiente Interceptor
  return next(requestHeadersToken).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status == 401) {
        // (1) Eliminar los datos que tengo almacenados en mi LocalStorage (token, userData)
        httpAuth.clearAuthData();
        // (2) Redireccionar
        router.navigateByUrl('/login');
      }

      // Define un error en RxJS
      return throwError(() => error);
    })
  );
}
