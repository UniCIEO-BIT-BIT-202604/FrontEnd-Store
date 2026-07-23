import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class HttpCategory {
  private http = inject( HttpClient );

  // Metodo para obtener todas las categorias
  getCategories() {
    // Http siempre devuelve los datos dentro de un Observable
    return this.http.get<any>( 'http://localhost:3000/api/categories' );
  }

  createCategory( newCategory: any ) {
    // Http siempre devuelve los datos dentro de un Observable
    return this.http.post( 'http://localhost:3000/api/categories', newCategory );
  }

}
