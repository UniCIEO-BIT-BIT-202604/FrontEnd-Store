import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CartResponse, SyncCartItemPayload, SyncCartPayload } from '../models/Cart';
import { HttpAuth } from './http-auth';

@Injectable({
  providedIn: 'root'
})
export class HttpCart {
  private http = inject(HttpClient);
  private authHttp = inject(HttpAuth);
  private BASE_URL: string = environment.apiUrl;

  private getHeader(): HttpHeaders {
    const token = this.authHttp.token;
    return new HttpHeaders({
      'X-Token': token || ''
    });
  }

  /**
   * Obtiene el carrito persistido del usuario autenticado desde el servidor.
   */
  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${this.BASE_URL}/cart`, { headers: this.getHeader() });
  }

  /**
   * Actualiza los elementos del carrito en el servidor.
   */
  updateCart(items: SyncCartItemPayload[]): Observable<CartResponse> {
    return this.http.put<CartResponse>(`${this.BASE_URL}/cart`, { items }, { headers: this.getHeader() });
  }

  /**
   * Sincroniza y fusiona (Merge) los elementos del carrito anónimo con el del usuario tras el login.
   */
  syncCart(payload: SyncCartPayload): Observable<CartResponse> {
    return this.http.post<CartResponse>(`${this.BASE_URL}/cart/sync`, payload, { headers: this.getHeader() });
  }

  /**
   * Elimina un ítem específico del carrito en el servidor.
   */
  removeItem(productId: string): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.BASE_URL}/cart/item/${productId}`, { headers: this.getHeader() });
  }

  /**
   * Vacía el carrito completo en el servidor.
   */
  clearCart(): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.BASE_URL}/cart`, { headers: this.getHeader() });
  }
}
