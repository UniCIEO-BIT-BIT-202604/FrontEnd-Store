import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpAuth } from '../services/http-auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const httpAuth = inject(HttpAuth);
  const token = httpAuth.token;

  // Si existe token, clonamos la petición adjuntando la cabecera 'X-Token'
  if (token) {
    const authReq = req.clone({
      headers: req.headers
        .set('X-Token', token)
        .set('X-Procesado-Por', 'AuthInterceptor')
    });
    return next(authReq);
  }

  // Si no hay token, continua con la petición original
  return next(req);
};
