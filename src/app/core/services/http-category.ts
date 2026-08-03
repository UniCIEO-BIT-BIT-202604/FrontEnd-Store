import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpAuth } from './http-auth';

@Service()
export class HttpCategory {
  private BASE_URL: string = environment.apiUrl;
  private http = inject(HttpClient);
  private httpAuth = inject(HttpAuth);

  // Helper para construir los encabezados enviando el token
  private getHeaders(): HttpHeaders {
    const token = this.httpAuth.token;

    // Usando X-Token (requerido por nuestro Backend):
    return new HttpHeaders({
      'X-Token': token || '',
      'X-Origen': 'Servicio-HttpCategory'
    });

    // Usando X-Token con .set()
    return new HttpHeaders().set('X-Token', token || '');

    // Usando Bearer Token (Comentada con fines educativos):
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Usando Bearer Token con .set() (Comentado con fines educativos)
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }


  // Metodo para obtener todas las categorias
  getCategories() {
    // Http siempre devuelve los datos dentro de un Observable
    return this.http.get<any>(`${this.BASE_URL}/categories`, { headers: this.getHeaders() });
  }

  createCategory(newCategory: any) {
    // Http siempre devuelve los datos dentro de un Observable
    return this.http.post<any>(`${this.BASE_URL}/categories`, newCategory, { headers: this.getHeaders() });
  }

  deleteCategory(id: string | null) {
    // Http siempre devuelve los datos dentro de un Observable
    return this.http.delete<any>(`${this.BASE_URL}/categories/${id}`, { headers: this.getHeaders() });
  }

  getCategoryById(id: string | null) {
    return this.http.get<any>(`${this.BASE_URL}/categories/${id}`, { headers: this.getHeaders() });
  }

  updateCategoryById(id: string | null, updatedCategory: any) {
    return this.http.patch<any>(`${this.BASE_URL}/categories/${id}`, updatedCategory, { headers: this.getHeaders() });
  }

}


