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
    return new HttpHeaders({
      'X-Token': token || ''
    });
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
