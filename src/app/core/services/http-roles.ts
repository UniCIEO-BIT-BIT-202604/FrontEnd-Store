import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class HttpRoles {
  private http = inject( HttpClient );

  // Hace la peticion para obtener todos los rolos del API
  getRoles() {
    // HttpClient (Observable)
    return this.http.get<any>( 'http://localhost:3000/api/roles' );
  }
}
