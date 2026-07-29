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
    return this.http.post<any>( 'http://localhost:3000/api/categories', newCategory );
  }

  deleteCategory( id: string | null ) {
    // Http siempre devuelve los datos dentro de un Observable
    return this.http.delete<any>( `http://localhost:3000/api/categories/${ id }` );
  }

  getCategoryById(id: string | null ) {
    return this.http.get<any>(`http://localhost:3000/api/categories/${id}`);
  }

  updateCategoryById( id: string | null, updatedCategory: any ) {
    return this.http.patch<any>(`http://localhost:3000/api/categories/${id}`, updatedCategory );
  }

}
