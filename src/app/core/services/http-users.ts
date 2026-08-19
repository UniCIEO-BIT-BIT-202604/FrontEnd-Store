import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpAuth } from './http-auth';

@Service()
export class HttpUsers {
  private http = inject(HttpClient);
  private authHttp = inject(HttpAuth);

  BASE_URL: string = environment.apiUrl;

  /**
   * Crea las cabeceras HTTP incluyendo el token de autenticación.
   */
  private getHeader(): HttpHeaders {
    const token = this.authHttp.token;
    const headers = new HttpHeaders({
      'X-Token': token || '',
      'X-Procesado-por': 'HttpUsers'
    });

    // Imprimir de forma legible la cabecera en consola (didáctico)
    console.log('Cabeceras enviadas desde HttpUsers:', {
      'X-Token': headers.get('X-Token'),
      'X-Procesado-por': headers.get('X-Procesado-por')
    });

    return headers;
  }

  createUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/users`, userData, { headers: this.getHeader() });
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/users`, { headers: this.getHeader() });
  }

  getUserById(id: string | null): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/users/${id}`, { headers: this.getHeader() });
  }

  deleteUserById(id: string | null): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/users/${id}`, { headers: this.getHeader() });
  }

  updateUserById(id: string | null, updatedUser: any): Observable<any> {
    return this.http.patch(`${this.BASE_URL}/users/${id}`, updatedUser, { headers: this.getHeader() });
  }
}

