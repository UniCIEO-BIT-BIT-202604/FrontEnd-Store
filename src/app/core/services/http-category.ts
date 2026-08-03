import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { HttpAuth } from './http-auth';

@Service()
export class HttpCategory {
  private http = inject( HttpClient );
  private authHttp = inject( HttpAuth );

  // Crear una cabecera y va a menter dentro de ella el token
  private getHeader(): HttpHeaders {
    // Obteniendo el token del getter del Servicio de AuthHttp
    const token = this.authHttp.token;

    // Crea y retorna un Header de Angular con el token y el nombre de la propiedad especificado en en Backend para recibir dicho valor.
    return new HttpHeaders({
      'X-Token': token || '',
      'Content-Type': 'application/json'
    });
  }

  // Metodo para obtener todas las categorias
  getCategories() {
    // Http siempre devuelve los datos dentro de un Observable
    return this.http.get<any>( 'http://localhost:3000/api/categories', { headers: this.getHeader() } );
  }

  createCategory( newCategory: any ) {
    // Http siempre devuelve los datos dentro de un Observable
    return this.http.post<any>( 'http://localhost:3000/api/categories', newCategory, { headers: this.getHeader() } );
  }

  deleteCategory( id: string | null ) {
    // Http siempre devuelve los datos dentro de un Observable
    return this.http.delete<any>( `http://localhost:3000/api/categories/${ id }`, { headers: this.getHeader() } );
  }

  getCategoryById(id: string | null ) {
    return this.http.get<any>(`http://localhost:3000/api/categories/${id}`, { headers: this.getHeader() });
  }

  updateCategoryById( id: string | null, updatedCategory: any ) {
    return this.http.patch<any>(`http://localhost:3000/api/categories/${id}`, updatedCategory, { headers: this.getHeader() } );
  }

}
