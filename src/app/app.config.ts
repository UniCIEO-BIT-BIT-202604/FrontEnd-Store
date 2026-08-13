import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { headerPrinterInterceptor } from './core/interceptors/header-printer.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { loggerInterceptor } from './core/interceptors/logger.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors(
        [
          authInterceptor,              // 1. Clona la petición e inyecta el token y headers de Auth
          headerPrinterInterceptor,     // 2. Captura y muestra las cabeceras ya clonadas
          loggerInterceptor             // 3. Imprime todos los detalles de la petición final y monitorea la respuesta
        ]
      )
    )
  ]
};



