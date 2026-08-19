import { HttpInterceptorFn } from '@angular/common/http';

export const loggerInterceptor: HttpInterceptorFn = (req, next) => {
  console.group(`HTTP Request: ${req.method} ${req.url}`);
  console.log('Método:', req.method);
  console.log('URL:', req.url);

  // Angular HttpHeaders encapsula sus datos internamente.
  // Para visualizar el objeto de cabeceras en consola de forma legible:
  const headersObj: Record<string, string | string[]> = {};
  req.headers.keys().forEach((key) => {
    headersObj[key] = req.headers.getAll(key) || req.headers.get(key) || '';
  });
  console.log('Cabeceras (Objeto):', headersObj);
  console.log('X-Token:', req.headers.get('X-Token'));
  console.log('X-Procesado-por:', req.headers.get('X-Procesado-por'));

  console.groupEnd();

  return next(req);
};

