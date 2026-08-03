import { HttpInterceptorFn } from '@angular/common/http';

export const loggerInterceptor: HttpInterceptorFn = (req, next) => {
  console.group('--- [HTTP Request Log] ---');
  console.log('Método:', req.method);
  console.log('URL Base:', req.url);
  console.log('URL con Params:', req.urlWithParams);
  console.log('Headers:', req.headers.keys().map(key => `${key}: ${req.headers.get(key)}`));
  console.log('Params:', req.params.toString());
  console.log('Body:', req.body);
  console.log('Tipo de Respuesta:', req.responseType);
  console.groupEnd();

  return next(req);
};
