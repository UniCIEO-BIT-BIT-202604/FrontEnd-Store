import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateOrderPayload, OrderListResponse, OrderResponse } from '../models/Order';
import { HttpAuth } from './http-auth';

@Service()
export class HttpOrders {
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
   * Crea una nueva orden de compra en el servidor.
   */
  createOrder(payload: CreateOrderPayload): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.BASE_URL}/orders`, payload, { headers: this.getHeader() });
  }

  /**
   * Obtiene el historial de órdenes del usuario autenticado.
   */
  getUserOrders(): Observable<OrderListResponse> {
    return this.http.get<OrderListResponse>(`${this.BASE_URL}/orders`, { headers: this.getHeader() });
  }

  /**
   * Obtiene el detalle de una orden por su ID.
   */
  getOrderById(id: string): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.BASE_URL}/orders/${id}`, { headers: this.getHeader() });
  }
}
