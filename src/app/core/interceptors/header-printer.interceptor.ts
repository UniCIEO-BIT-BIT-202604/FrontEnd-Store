import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor HTTP de Impresión de Cabeceras (Header Printer Interceptor).
 * 
 * Su única responsabilidad es inspeccionar e imprimir en consola las cabeceras HTTP
 * recibidas tal como vienen del servicio, manteniéndolo desacoplado de la lógica de modificación del token.
 */
export const headerPrinterInterceptor: HttpInterceptorFn = (req, next) => {
  console.group('3️⃣ [HeaderPrinterInterceptor] Cabeceras resultantes recibidas tras la clonación de AuthInterceptor');
  console.log(`🔗 Endpoint: ${req.method} -> ${req.url}`);
  
  if (req.headers.keys().length === 0) {
    console.log('⚠️ Esta petición no incluye cabeceras iniciales.');
  } else {
    req.headers.keys().forEach(key => {
      console.log(`   ${key}: ${req.headers.get(key)}`);
    });
  }
  console.groupEnd();

  return next(req);
};
