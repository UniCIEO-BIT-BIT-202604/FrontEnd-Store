import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { HttpAuth } from '../services/http-auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const httpAuth = inject(HttpAuth);
  const router = inject(Router);
  const token = httpAuth.token;

  let requestToSend = req;

  // Si existe token, clonamos la petición adjuntando la cabecera 'X-Token'
  if (token) {
    requestToSend = req.clone({
      headers: req.headers
        .set('X-Token', token)
        .set('X-Procesado-Por', 'AuthInterceptor')
    });
  }

  return next(requestToSend).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.warn('[AuthInterceptor] Sesión expirada o no autorizada (401). Limpiando datos...');
        httpAuth.clearAuthData();
        router.navigateByUrl('/login');
      }
      return throwError(() => error);
    })
  );
};

