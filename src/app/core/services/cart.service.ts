import { inject, Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, EMPTY } from 'rxjs';
import { catchError, debounceTime, map, switchMap, tap } from 'rxjs/operators';
import { CartItem, CartResponse, SyncCartPayload } from '../models/Cart';
import { Product } from '../models/Product';
import { HttpCart } from './http-cart';
import { HttpAuth } from './http-auth';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'cart_items';
  private httpCart = inject(HttpCart);
  private injector = inject(Injector);

  private itemsSubject: BehaviorSubject<CartItem[]>;
  public items$: Observable<CartItem[]>;

  // Subject reactivo para agrupar y estabilizar peticiones HTTP al servidor (Evita Race Conditions por clics rápidos)
  private updateServerSubject = new Subject<CartItem[]>();

  // Getter diferido (lazy) para romper la dependencia circular entre HttpAuth y CartService
  private get httpAuth(): HttpAuth {
    return this.injector.get(HttpAuth);
  }

  constructor() {
    const savedItems = this.loadCartFromStorage();
    this.itemsSubject = new BehaviorSubject<CartItem[]>(savedItems);
    this.items$ = this.itemsSubject.asObservable();

    // Inicializar el flujo reactivo de sincronización con debounceTime y switchMap
    this.initServerSyncStream();

    // Si la aplicación inicia y el usuario ya está autenticado, cargar su carrito desde la DB
    setTimeout(() => {
      if (this.httpAuth.isLoggedIn()) {
        this.loadCartFromServer();
      }
    }, 0);
  }

  /**
   * Configura el flujo reactivo para enviar cambios al backend de forma estabilizada (Debounced),
   * cancelando peticiones obsoletas y evitando sobreescrituras por clics rápidos (Race Condition).
   */
  private initServerSyncStream(): void {
    this.updateServerSubject.pipe(
      // debounceTime: Espera 300ms de calma tras el último clic antes de continuar
      debounceTime(300),
      // switchMap: Cancela la petición anterior si se recibe una nueva
      switchMap((items) => {
        if (!this.httpAuth.isLoggedIn()) {
          return EMPTY;
        }

        const payload = items
          .filter(item => item.product && item.product._id)
          .map(item => ({
            product: item.product._id!,
            quantity: item.quantity
          }));

        return this.httpCart.updateCart(payload).pipe(
          catchError(err => {
            console.error('Error al actualizar el carrito en el servidor:', err);
            return EMPTY;
          })
        );
      })
    ).subscribe();
  }

  /**
   * Carga el carrito del usuario autenticado desde el backend (MongoDB).
   */
  public loadCartFromServer(): void {
    if (!this.httpAuth.isLoggedIn()) return;

    this.httpCart.getCart().subscribe({
      next: (res) => {
        if (res?.data?.items) {
          this.setItems(res.data.items);
          localStorage.removeItem(this.STORAGE_KEY);
        }
      },
      error: (err) => {
        console.error('Error al obtener el carrito del servidor:', err);
      }
    });
  }

  /**
   * Sincroniza y fusiona (Merge) el carrito anónimo del localStorage con el servidor al autenticarse.
   */
  public syncCartWithServer(): Observable<CartResponse | null> {
    if (!this.httpAuth.isLoggedIn()) {
      return of(null);
    }

    const localItems = this.items;
    const payload: SyncCartPayload = {
      items: localItems
        .filter(item => item.product && item.product._id)
        .map(item => ({
          product: item.product._id!,
          quantity: item.quantity
        }))
    };

    return this.httpCart.syncCart(payload).pipe(
      // tap: Ejecuta una acción por cada emisión del observable sin alterar el flujo
      tap((res) => {
        if (res?.data?.items) {
          // Limpiar localStorage anónimo
          localStorage.removeItem(this.STORAGE_KEY);
          // Actualizar el estado reactivo con la lista consolidada devuelta por MongoDB
          this.setItems(res.data.items);
        }
      }),
      // catchError: Atrapa el error y devuelve un observable con el valor por defecto (null)
      catchError((err) => {
        console.error('Error al sincronizar el carrito con el servidor:', err);
        return of(null);
      })
    );
  }

  /**
   * Carga el carrito guardado en el localStorage del navegador.
   */
  private loadCartFromStorage(): CartItem[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al cargar el carrito del localStorage:', error);
      return [];
    }
  }

  /**
   * Guarda el estado actual en localStorage (si es anónimo) y notifica a los suscriptores.
   */
  private saveCart(items: CartItem[]): void {
    if (!this.httpAuth.isLoggedIn()) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Error al guardar el carrito en localStorage:', error);
      }
    }
    this.itemsSubject.next(items);
  }

  /**
   * Obtiene la lista actual de ítems síncronamente.
   */
  public get items(): CartItem[] {
    return this.itemsSubject.getValue();
  }

  /**
   * Observable derivado para obtener la cantidad total de productos en el carrito.
   */
  public get totalItems$(): Observable<number> {
    return this.items$.pipe(
      map(items => items.reduce((acc, item) => acc + item.quantity, 0))
    );
  }

  /**
   * Observable derivado para calcular el monto total a pagar.
   */
  public get totalAmount$(): Observable<number> {
    return this.items$.pipe(
      map(items => items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0))
    );
  }

  /**
   * Agrega un producto al carrito.
   */
  public addItem(product: Product, quantityToAdd: number = 1): void {
    if (!product || !product._id || product.stock <= 0) {
      return;
    }

    const currentItems = [...this.items];
    const index = currentItems.findIndex(item => item.product._id === product._id);

    if (index > -1) {
      const currentQty = currentItems[index].quantity;
      const newQty = Math.min(currentQty + quantityToAdd, product.stock);
      currentItems[index] = {
        ...currentItems[index],
        quantity: newQty
      };
    } else {
      const initialQty = Math.min(quantityToAdd, product.stock);
      if (initialQty > 0) {
        currentItems.push({ product, quantity: initialQty });
      }
    }

    this.saveCart(currentItems);

    if (this.httpAuth.isLoggedIn()) {
      this.persistCartToServer(currentItems);
    }
  }

  /**
   * Actualiza la cantidad de un producto.
   */
  public updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const currentItems = [...this.items];
    const index = currentItems.findIndex(item => item.product._id === productId);

    if (index > -1) {
      const productStock = currentItems[index].product.stock;
      currentItems[index] = {
        ...currentItems[index],
        quantity: Math.min(quantity, productStock)
      };
      this.saveCart(currentItems);

      if (this.httpAuth.isLoggedIn()) {
        this.persistCartToServer(currentItems);
      }
    }
  }

  /**
   * Elimina un producto del carrito.
   */
  public removeItem(productId: string): void {
    const updatedItems = this.items.filter(item => item.product._id !== productId);
    this.saveCart(updatedItems);

    if (this.httpAuth.isLoggedIn()) {
      this.persistCartToServer(updatedItems);
    }
  }

  /**
   * Vacía el carrito.
   */
  public clearCart(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.itemsSubject.next([]);

    if (this.httpAuth.isLoggedIn()) {
      this.httpCart.clearCart().subscribe({
        error: (err) => console.error('Error al vaciar el carrito en el servidor:', err)
      });
    }
  }

  /**
   * Reemplaza la lista completa de ítems.
   */
  public setItems(items: CartItem[]): void {
    this.saveCart(items);
  }

  /**
   * Envía la lista de ítems actualizada al flujo estabilizado con debounce.
   */
  private persistCartToServer(items: CartItem[]): void {
    this.updateServerSubject.next(items);
  }
}
