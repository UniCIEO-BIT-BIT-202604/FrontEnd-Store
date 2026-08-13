import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError, throwError } from 'rxjs';

/**
 * Interceptor HTTP de Angular (Functional Interceptor).
 * 
 * EXPLICACIÓN Y CONCEPTO CLAVE:
 * Un Interceptor en Angular actúa como un "middleware" centralizado por el que PASAN ABSOLUTAMENTE
 * TODAS LAS PETICIONES HTTP salientes de la aplicación y TODAS LAS RESPUESTAS entrantes del servidor.
 * 
 * ¿Por qué es tan importante y qué información nos ofrece?
 * 1. Acceso total a la solicitud (Request):
 *    - Método HTTP (GET, POST, PUT, DELETE, etc.)
 *    - URL destino completa y sus Query Parameters.
 *    - Cabeceras (Headers), como tokens de autenticación (Authorization: Bearer <token>).
 *    - Cuerpo del mensaje (Body) enviando datos al backend.
 * 
 * 2. Acceso total a la respuesta (Response):
 *    - Código de estado HTTP (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 500 Internal Error, etc.).
 *    - Datos de respuesta devueltos por el backend.
 *    - Medición exacta del tiempo de respuesta (latencia de red).
 * 
 * 3. Casos de uso comunes:
 *    - Inyección automática de Tokens JWT en las cabeceras.
 *    - Manejo centralizado de errores (ej. redirigir a /login si el token expira o retorna 401).
 *    - Activación de spinners o cargadores globales (Loading UI).
 *    - Logging y auditoría de red en entorno de desarrollo.
 */
export const loggerInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = Date.now();

  // 1. INFORMACIÓN DE LA PETICIÓN SALIENTE (REQUEST)
  console.group(`🚀 [HTTP Interceptor] Petición Saliente: ${req.method} -> ${req.url}`);
  console.log('📌 Explicación: Cualquier petición HTTP realizada en la aplicación pasa obligatoriamente por aquí.');
  console.log('🔗 URL completa:', req.urlWithParams);
  console.log('🛠️ Método:', req.method);
  console.log('📋 Headers enviados:', req.headers.keys().map(key => `${key}: ${req.headers.get(key)}`));
  console.log('📦 Body (Cuerpo enviado):', req.body ?? 'Sin cuerpo / GET request');
  console.log('🔎 Query Params:', req.params.toString() || 'Sin parámetros');

  // 🔍 1. VERIFICAR SI VIENE UN TOKEN EN CABECERAS DE LA PETICIÓN (REQUEST)
  // Se puede consultar cualquier header usando req.headers.get('nombre-del-header') o req.headers.has('nombre')
  const authHeader = req.headers.get('Authorization');
  const customTokenHeader = req.headers.get('x-token') || req.headers.get('access-token');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    console.log('🔑 Header Authorization detectado:', authHeader);
  } else if (customTokenHeader) {
    console.log('🔑 Header personalizado de Token detectado (x-token / access-token):', customTokenHeader);
  } else {
    console.log('⚠️ No se detectó ninguna cabecera de Token (Authorization / x-token) en esta petición.');
  }

  // Ejemplo de inyección de Token (Auth Interceptor):
  const token = localStorage.getItem('token');
  if (token && (!authHeader || !authHeader.startsWith('Bearer '))) {
    console.log('💡 Token disponible en localStorage. Podríamos clonar la petición (req.clone) para inyectar "Authorization: Bearer ' + token + '"');
  }
  console.groupEnd();

  // 2. PASAMOS LA PETICIÓN AL SIGUIENTE PASO Y ESCUCHAMOS LA RESPUESTA (RESPONSE)
  return next(req).pipe(
    tap({
      next: (event) => {
        // Verificamos si el evento es una respuesta HTTP completada
        if (event instanceof HttpResponse) {
          const elapsedTime = Date.now() - startTime;

          // 🔍 VERIFICAR SI EL SERVIDOR NOS DEVUELVE UN TOKEN EN LOS HEADERS DE LA RESPUESTA
          const responseAuthHeader = event.headers.get('Authorization') || event.headers.get('x-token');
          if (responseAuthHeader) {
            console.log('🎉 ¡El servidor devolvió un nuevo token en los Headers de la Respuesta!:', responseAuthHeader);
          }

          console.group(`✅ [HTTP Interceptor] Respuesta Recibida (${event.status} ${event.statusText})`);
          console.log(`⏱️ Tiempo transcurrido: ${elapsedTime} ms`);
          console.log('🔗 URL de la respuesta:', event.url);
          console.log('📥 Status Code:', event.status);
          console.log('📊 Headers de respuesta:', event.headers);
          console.log('📦 Body devuelto por el servidor:', event.body);
          console.groupEnd();
        }
      }
    }),
    catchError((error: HttpErrorResponse) => {
      const elapsedTime = Date.now() - startTime;

      console.group(`❌ [HTTP Interceptor] Error en Petición HTTP (${error.status})`);
      console.log(`⏱️ Tiempo hasta el fallo: ${elapsedTime} ms`);
      console.log('🔗 URL con error:', req.url);
      console.log('🚨 Mensaje de error:', error.message);
      console.log('📄 Detalle del error (error.error):', error.error);

      if (error.status === 401) {
        console.warn('⚠️ Se detectó error 401 (No autorizado). Aquí podrías redirigir al login o limpiar la sesión.');
      } else if (error.status === 500) {
        console.error('💥 Error 500 en el servidor.');
      }
      console.groupEnd();

      return throwError(() => error);
    })
  );
};
