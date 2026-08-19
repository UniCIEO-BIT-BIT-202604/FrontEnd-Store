import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injector, PLATFORM_ID, Service } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpCartStore } from './http-cart-store';

@Service()
export class HttpAuth {
  private BASE_URL: string = environment.apiUrl;

  // Claves para almacenar el token y el usuario en localStorage
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';

  private http = inject(HttpClient);
  private router = inject(Router);
  private injector = inject(Injector);

  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean = isPlatformBrowser(this.platformId);

  // Getter diferido (lazy) para acceder a HttpCartStore y romper la dependencia circular
  private get httpCartStore(): HttpCartStore {
    return this.injector.get(HttpCartStore);
  }

  // Estado reactivo con RxJS BehaviorSubject inicializado desde localStorage
  private currentUser$ = new BehaviorSubject<any>(this.getUserFromStorage());
  private token$ = new BehaviorSubject<string | null>(this.getTokenFromStorage());

  // Observables públicos
  user$ = this.currentUser$.asObservable();
  tokenObservable$ = this.token$.asObservable();
  isAuthenticated$ = this.token$.pipe(map(token => !!token));

  constructor() {
    this.token$.subscribe((val) => console.log('[BehaviorSubject Token]:', val));
    this.currentUser$.subscribe((val) => console.log('[BehaviorSubject User]:', val));
  }

  loginUser(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/auth/login`, credentials).pipe(
      tap((res) => {
        if (res?.token && res?.data) {
          this.setAuthData(res.token, res.data);

          // Fusión de Carrito: Sincronizar el carrito de localStorage con MongoDB
          this.httpCartStore.syncCartWithServer().subscribe({
            next: () => {
              console.log('Carrito sincronizado exitosamente con MongoDB tras el login');
            },
            error: (err) => {
              console.error('Error al sincronizar carrito tras login:', err);
            }
          });
        }
      }),
      map((data) => data.msg),
      catchError((err: HttpErrorResponse) => {
        console.error(err);
        const errorMsg = err.error?.msg || 'Error al iniciar sesión';
        return throwError(() => errorMsg);
      })
    );
  }

  registerUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/auth/register`, userData).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error(err);
        const errorMsg = err.error?.msg || 'Error al registrar el usuario';
        return throwError(() => errorMsg);
      })
    );
  }

  setAuthData(token: string, user: any): void {
    this.token = token;
    this.user = user;
  }

  clearAuthData(): void {
    this.token = null;
    this.user = null;
  }

  logoutUser(): void {
    this.clearAuthData();
    this.httpCartStore.clearCart();
  }

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

  get token(): string | null {
    return this.token$.getValue();
  }

  get user(): any {
    return this.currentUser$.getValue();
  }
}
