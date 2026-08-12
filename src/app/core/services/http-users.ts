import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpAuth } from './http-auth';

@Service()
export class HttpUsers {
  // Inyectar dependencias
  private http = inject( HttpClient );
  private authHttp = inject( HttpAuth );

  BASE_URL: string = environment.apiUrl;

  private getHeader(): HttpHeaders {
    const token = this.authHttp.token;

    return new HttpHeaders({
      'X-Token': token || '',
      'Content-Type': 'application/json'
    });
  }

  createUser( newUser: any ) {
    return this.http.post<any>( `${ this.BASE_URL }/users`, newUser, { headers: this.getHeader() } );
  }

  getUsers() {
    // Observable (HttpClient)
    return this.http.get<any>( `${ this.BASE_URL }/users`, { headers: this.getHeader() } );
  }

  getUserById( id: string | null ) {
    // Observable (HttpClient)
    return this.http.get<any>( `${ this.BASE_URL }/users/${ id }`, { headers: this.getHeader() } );
  }

  deleteUserById( id: string | null ) {
    // Observable (HttpClient)
    return this.http.delete( `${ this.BASE_URL }/users/${ id }`, { headers: this.getHeader() } );
  }

  updateUserById( id: string | null, updatedUser: any ) {
    // Observable (HttpClient)
    return this.http.patch( `${ this.BASE_URL }/users/${ id }`, updatedUser, { headers: this.getHeader() } );
  }

}



