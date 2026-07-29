import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Service()
export class HttpAuth {
  private BASE_URL: string = environment.apiUrl;

  private http = inject(HttpClient);
  private router = inject(Router);

  loginUser(credentials: any) {
    // credentias { "email": "amed@example.com", "password": "123456789" }

    return this.http.post<any>(`${this.BASE_URL}/auth/login`, credentials).pipe(
      // 1. tap permite ejecutar acciones secundarias. En este caso, guardar el Token y los datos del usuario en localStorage
      tap((res) => {

        // Verificamos que la respuesta contenga las propiedades esperadas
        if (res?.token && res?.data) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.data));

          // Redireccionamos
          this.router.navigateByUrl('/dashboard');
        }

        //console.log( data );
      }),
      // 2. map muta o transforma el valor que viene del servidor. En este caso, extraemos el mensaje de la propiedad msg
      map((data) => data.msg),
      // 3. catchError intercepta respuestas con estado 400, 401, 500, etc.
      catchError((err: HttpErrorResponse) => {

        console.error(err);

        // Extraemos el mensaje de la propiedad error
        const errorMsg = err.error?.msg || 'Error al iniciar sesión';

        return of(errorMsg);    // of() sirve para devolver un nuevo Observable que emite el valor pasado como argumento.
      })
    )
  }
}
