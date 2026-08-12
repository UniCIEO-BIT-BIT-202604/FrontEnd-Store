import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductListResponse, ProductResponse } from '../models/Product';

@Injectable({
  providedIn: 'root'
})
export class HttpProducts {
  private http = inject(HttpClient);
  private BASE_URL: string = environment.apiUrl;

  getProducts(): Observable<ProductListResponse> {
    return this.http.get<ProductListResponse>(`${this.BASE_URL}/products`);
  }

  getProductById(id: string | null): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.BASE_URL}/products/${id}`);
  }

  createProduct(formData: FormData): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(`${this.BASE_URL}/products`, formData);
  }

  updateProduct(id: string | null, formData: FormData): Observable<ProductResponse> {
    return this.http.patch<ProductResponse>(`${this.BASE_URL}/products/${id}`, formData);
  }

  deleteProduct(id: string | null): Observable<ProductResponse> {
    return this.http.delete<ProductResponse>(`${this.BASE_URL}/products/${id}`);
  }
}
