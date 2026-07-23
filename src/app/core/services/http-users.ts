import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';

@Service()
export class HttpUsers {
  // Inyectar una dependencia
  private http = inject( HttpClient );

  BASE_URL: string = environment.apiUrl;
  createUser() {}

  getUsers() {
    // Observable (HttpClient)
    return this.http.get<any>( `${ this.BASE_URL }/users` )
  }

  getUserById( id: string | null ) {
    // Observable (HttpClient)
    return this.http.get<any>( `${ this.BASE_URL }/users/${ id }` );
  }

  deleteUserById( id: string | null ) {
    // Observable (HttpClient)
    return this.http.delete( `${ this.BASE_URL }/users/${ id }` );
  }

  updateUserById( id: string | null, updatedUser: any ) {
    // Observable (HttpClient)
    return this.http.patch( `${ this.BASE_URL }/users/${ id }`, updatedUser );
  }

}



