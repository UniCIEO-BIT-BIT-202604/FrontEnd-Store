import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class HttpProducts {
  // Inyectar una dependencia usando el constructor
  // constructor( private http: HttpClient ) {}
  // Inyectar una dependencia sin usar el constructor, implementarse en las funciones
  private http = inject( HttpClient );

  createProduct( newProduct: any ) {
    return this.http.post( 'http://localhost:3000/api/products', newProduct );
  }

}
