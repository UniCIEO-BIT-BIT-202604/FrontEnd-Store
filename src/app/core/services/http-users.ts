import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpAuth } from './http-auth';

@Injectable({
  providedIn: 'root'
})
export class HttpUsers {
  private http = inject(HttpClient);
  private authHttp = inject(HttpAuth);

  BASE_URL: string = environment.apiUrl;

  private getHeader(): HttpHeaders {
    const token = this.authHttp.token;

    // Opción 1 (Habilitada): Cabecera personalizada 'x-token' + 'X-Procesado-Por'
    const headers = new HttpHeaders({
      'x-token': token || '',
      'X-Procesado-Por': 'HttpUsers'
    });

    console.group('1️⃣ [Service HttpUsers] Cabeceras creadas en el Servicio');
    headers.keys().forEach(key => {
      console.log(`   ${key}: ${headers.get(key)}`);
    });
    console.groupEnd();

    return headers;

    // Opción 2 (Comentada): Cabecera estándar 'Authorization: Bearer <token>' + 'X-Procesado-Por'
    // return new HttpHeaders({
    //   'Authorization': `Bearer ${token || ''}`,
    //   'X-Procesado-Por': 'HttpUsers'
    // });

    // Opción 3 (Comentada): Cabecera personalizada 'access-token' + 'X-Procesado-Por'
    // return new HttpHeaders({
    //   'access-token': token || '',
    //   'X-Procesado-Por': 'HttpUsers'
    // });

    // Opción 4 (Comentada): Múltiples cabeceras al mismo tiempo
    // return new HttpHeaders({
    //   'Authorization': `Bearer ${token || ''}`,
    //   'x-token': token || '',
    //   'X-Procesado-Por': 'HttpUsers'
    // });
  }

  createUser(userData: any) {
    return this.http.post<any>(`${this.BASE_URL}/users`, userData, { headers: this.getHeader() });
  }

  getUsers() {
    return this.http.get<any>(`${this.BASE_URL}/users`, { headers: this.getHeader() });
  }

  getUserById(id: string | null) {
    return this.http.get<any>(`${this.BASE_URL}/users/${id}`, { headers: this.getHeader() });
  }

  deleteUserById(id: string | null) {
    return this.http.delete(`${this.BASE_URL}/users/${id}`, { headers: this.getHeader() });
  }

  updateUserById(id: string | null, updatedUser: any) {
    return this.http.patch(`${this.BASE_URL}/users/${id}`, updatedUser, { headers: this.getHeader() });
  }
}
