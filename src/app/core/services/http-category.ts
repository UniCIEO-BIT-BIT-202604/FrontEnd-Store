import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category, CategoryListResponse, CategoryResponse } from '../models/Category';
import { HttpAuth } from './http-auth';

@Service()
export class HttpCategory {
  private http = inject(HttpClient);
  private authHttp = inject(HttpAuth);
  private BASE_URL: string = environment.apiUrl;

  private getHeader(): HttpHeaders {
    const token = this.authHttp.token;
    return new HttpHeaders({
      'X-Token': token || ''
    });
  }

  getCategories(): Observable<CategoryListResponse> {
    return this.http.get<CategoryListResponse>(`${this.BASE_URL}/categories`, { headers: this.getHeader() });
  }

  getCategoryById(id: string | null): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.BASE_URL}/categories/${id}`, { headers: this.getHeader() });
  }

  createCategory(newCategory: FormData | Partial<Category>): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(`${this.BASE_URL}/categories`, newCategory, { headers: this.getHeader() });
  }

  updateCategory(id: string | null, updatedCategory: FormData | Partial<Category>): Observable<CategoryResponse> {
    return this.http.patch<CategoryResponse>(`${this.BASE_URL}/categories/${id}`, updatedCategory, { headers: this.getHeader() });
  }

  updateCategoryById(id: string | null, updatedCategory: FormData | Partial<Category>): Observable<CategoryResponse> {
    return this.updateCategory(id, updatedCategory);
  }

  deleteCategory(id: string | null): Observable<CategoryResponse> {
    return this.http.delete<CategoryResponse>(`${this.BASE_URL}/categories/${id}`, { headers: this.getHeader() });
  }
}
