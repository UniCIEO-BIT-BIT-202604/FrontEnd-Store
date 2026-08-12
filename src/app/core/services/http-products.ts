import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductListResponse, ProductResponse } from '../models/Product';
import { HttpAuth } from './http-auth';

@Injectable({
  providedIn: 'root'
})
export class HttpProducts {
  private http = inject(HttpClient);
  private authHttp = inject(HttpAuth);
  private BASE_URL: string = environment.apiUrl;

  private getHeader(): HttpHeaders {
    const token = this.authHttp.token;
    return new HttpHeaders({
      'X-Token': token || ''
    });
  }

  getProducts(): Observable<ProductListResponse> {
    return this.http.get<ProductListResponse>(`${this.BASE_URL}/products`, { headers: this.getHeader() });
  }

  getProductById(id: string | null): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.BASE_URL}/products/${id}`, { headers: this.getHeader() });
  }

  createProduct(formData: FormData): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(`${this.BASE_URL}/products`, formData, { headers: this.getHeader() });
  }

  updateProduct(id: string | null, formData: FormData): Observable<ProductResponse> {
    return this.http.patch<ProductResponse>(`${this.BASE_URL}/products/${id}`, formData, { headers: this.getHeader() });
  }

  deleteProduct(id: string | null): Observable<ProductResponse> {
    return this.http.delete<ProductResponse>(`${this.BASE_URL}/products/${id}`, { headers: this.getHeader() });
  }
}
