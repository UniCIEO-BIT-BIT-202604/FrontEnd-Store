import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID, Service } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Service()
export class HttpAuth {
  private BASE_URL: string = environment.apiUrl;

  // Claves para almacenar el token y el usuario en localStorage (Evitamos colisiones con otras librerias o errores tipograficos humanos)
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';

  // Inyecta HttpClient para realizar peticiones HTTP
  private http = inject(HttpClient);
  // Inyecta Router para redirigir al usuario después de iniciar sesión
  private router = inject(Router);

  // Inyecta PLATFORM_ID para verificar si la app se ejecuta en el navegador
  private platformId = inject(PLATFORM_ID);
  // Determino si la aplicacion se esta ejecutando en el navegador
  private isBrowser: boolean = isPlatformBrowser(this.platformId);

  // Estado reactivo con RxJS BehaviorSubject inicializado desde localStorage (si está en el navegador)
  private currentUser$ = new BehaviorSubject<any>(this.getUserFromStorage());
  private token$ = new BehaviorSubject<string | null>(this.getTokenFromStorage());

  // Observables públicos para exponer el estado a los componentes
  user$ = this.currentUser$.asObservable();
  tokenObservable$ = this.token$.asObservable();
  isAuthenticated$ = this.token$.pipe(map(token => !!token));

  constructor() {
    // Escuchar e imprimir los cambios del BehaviorSubject de token
    this.token$.subscribe((val) => console.log('[BehaviorSubject Token]:', val));
    // Escuchar e imprimir los cambios del BehaviorSubject del usuario
    this.currentUser$.subscribe((val) => console.log('[BehaviorSubject User]:', val));
  }

  loginUser(credentials: any) {
    // credentials { "email": "amed@example.com", "password": "123456789" }
    return this.http.post<any>(`${this.BASE_URL}/auth/login`, credentials).pipe(
      // Sirve para generar acciones de acuerdo a la respuesta del servidor
      tap((res) => {
        // Verificamos que la respuesta contenga las propiedades esperadas
        if (res?.token && res?.data) {
          // Usamos setAuthData para activar los setters y actualizar el estado reactivo + localStorage
          this.setAuthData(res.token, res.data);

          // Redireccionamos al dashboard
          this.router.navigateByUrl('/dashboard');
        }
      }),
      map((data) => data.msg),
      catchError((err: HttpErrorResponse) => {
        console.error(err);
        const errorMsg = err.error?.msg || 'Error al iniciar sesión';
        return of(errorMsg);
      })
    );
  }

  /**
   * Método para verificar la validez del token y renovarlo contra el Backend.
   * Realiza una petición GET a '/auth/renew-token' pasando el token actual mediante interceptores.
   * Si el token es válido, actualiza localStorage y el estado reactivo con el nuevo token.
   */
  checkAuthStatus(): Observable<boolean> {
    const token = this.token;
    if (!token) {
      this.clearAuthData();
      return of(false);
    }

    return this.http.get<any>(`${this.BASE_URL}/auth/renew-token`).pipe(
      tap((res) => {
        if (res?.token && res?.data) {
          this.setAuthData(res.token, res.data);
        }
      }),
      map((res) => !!res?.token),
      catchError((err: HttpErrorResponse) => {
        console.error('💥 Error al renovar token en Backend:', err);
        this.clearAuthData();
        return of(false);
      })
    );
  }

  setAuthData(token: string, user: any): void {
    this.token = token;   // Ejecuta el setter 'set token(token)' -> guarda en localStorage y emite a token$
    this.user = user;     // Ejecuta el setter 'set user(user)' -> guarda en localStorage y emite a currentUser$
  }

  clearAuthData(): void {
    this.token = null;    // Ejecuta el setter 'set token(null)' -> elimina de localStorage y emite null a token$
    this.user = null;     // Ejecuta el setter 'set user(null)' -> elimina de localStorage y emite null a currentUser$
  }

  logoutUser(): void {
    this.clearAuthData();
  }

  // Método para verificar si el usuario está autenticado (retorna true si existe un token)
  isLoggedIn(): boolean {
    return !!this.token && !!this.user;
  }

  private getTokenFromStorage(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  private getUserFromStorage(): any {
    if (this.isBrowser) {
      const user = localStorage.getItem(this.USER_KEY);
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  // Setters que mantienen sincronizados localStorage (solo en el navegador) y RxJS BehaviorSubject
  set token(token: string | null) {
    if (this.isBrowser) {
      if (token) {
        localStorage.setItem(this.TOKEN_KEY, token);
      } else {
        localStorage.removeItem(this.TOKEN_KEY);
      }
    }
    this.token$.next(token);
    console.log('[Setter Token]:', token);
  }

  set user(user: any) {
    if (this.isBrowser) {
      if (user) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(this.USER_KEY);
      }
    }
    this.currentUser$.next(user);
    console.log('[Setter User]:', user);
  }

  // Getters para obtener el valor actual síncronamente
  get token(): string | null {
    return this.token$.getValue();
  }

  get user(): any {
    return this.currentUser$.getValue();
  }
}
