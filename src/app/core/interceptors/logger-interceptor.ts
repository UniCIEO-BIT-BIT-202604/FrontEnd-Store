import { HttpInterceptorFn } from '@angular/common/http';

export const loggerInterceptor: HttpInterceptorFn = (req, next) => {
  // Mapeamos las cabeceras finales enviadas a un objeto limpio clave-valor
  const headersObj: Record<string, string | null> = {};

  req.headers.keys().forEach(key => {
    headersObj[key] = req.headers.get(key);
  });

  console.group('--- [HTTP Request Log] ---');
  console.log('Método:', req.method);
  console.log('URL Base:', req.url);
  console.log('URL con Params:', req.urlWithParams);
  console.log('Headers Finales Enviados:', headersObj);
  console.log('Params:', req.params.toString());
  console.log('Body:', req.body);
  console.log('Tipo de Respuesta:', req.responseType);
  console.groupEnd();

  return next(req);
};

