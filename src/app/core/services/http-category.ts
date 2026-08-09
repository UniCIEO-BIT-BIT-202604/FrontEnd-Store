import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category, CategoryListResponse, CategoryResponse } from '../models/Category';

@Injectable({
  providedIn: 'root'
})
export class HttpCategory {
  private http = inject(HttpClient);
  private BASE_URL: string = environment.apiUrl;

  getCategories(): Observable<CategoryListResponse> {
    return this.http.get<CategoryListResponse>(`${this.BASE_URL}/categories`);
  }

  getCategoryById(id: string | null): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.BASE_URL}/categories/${id}`);
  }

  createCategory(newCategory: FormData | Partial<Category>): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(`${this.BASE_URL}/categories`, newCategory);
  }

  updateCategory(id: string | null, updatedCategory: FormData | Partial<Category>): Observable<CategoryResponse> {
    return this.http.patch<CategoryResponse>(`${this.BASE_URL}/categories/${id}`, updatedCategory);
  }

  deleteCategory(id: string | null): Observable<CategoryResponse> {
    return this.http.delete<CategoryResponse>(`${this.BASE_URL}/categories/${id}`);
  }
}
