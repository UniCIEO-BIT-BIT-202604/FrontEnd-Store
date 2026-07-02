import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, tap } from 'rxjs';
import { ResponseUsers } from '../models/Users';

@Service()
export class HttpUsers {
  // Inyectar una dependencia
  private http = inject( HttpClient );

  // Metodo para realizar una peticion a mi API donde obtengo la lista de usuarios
  getUsers() {
    return this.http.get<ResponseUsers>( 'http://localhost:3000/api/users' ).pipe(
      tap( ( res ) => console.log( 'tap', res ) ),
      map( ( res ) => {
        console.log( 'map',res.data );
        return res.data;
      } )
    );
  }
}

