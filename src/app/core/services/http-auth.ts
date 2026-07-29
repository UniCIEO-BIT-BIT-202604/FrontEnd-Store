import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of, tap } from 'rxjs';

@Service()
export class HttpAuth {

  private http = inject( HttpClient );
  private router = inject( Router );

  loginUser ( credentials: any ) {
    // credentias { "email": "amed@example.com", "password": "123456789" }
    return this.http.post<any>( 'http://localhost:300/api/auth/login', credentials ).pipe(
      // Sirve para generar acciones de acuerdo a X o Y dato
      tap( ( data ) => {
        localStorage.setItem( 'token', data?.token );
        localStorage.setItem( 'user', JSON.stringify( data.data ) );

        // Redireccionamos
        this.router.navigateByUrl( '/dashboard' );

        //console.log( data );
      } ),
      map( ( data ) => data.msg ),
      catchError( () => of( 'Ha ocurrido un error' ) )
    )
  }
}
