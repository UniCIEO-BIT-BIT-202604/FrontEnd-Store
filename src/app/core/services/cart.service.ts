import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItem } from '../models/Cart';
import { Product } from '../models/Product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'cart_items';
  private itemsSubject: BehaviorSubject<CartItem[]>;
  public items$: Observable<CartItem[]>;

  constructor() {
    const savedItems = this.loadCartFromStorage();
    this.itemsSubject = new BehaviorSubject<CartItem[]>(savedItems);
    this.items$ = this.itemsSubject.asObservable();
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
   * Guarda el estado actual en localStorage y notifica a los suscriptores de RxJS.
   */
  private saveCart(items: CartItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error al guardar el carrito en localStorage:', error);
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
   * Agrega un producto al carrito o incrementa su cantidad respetando el stock disponible.
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
  }

  /**
   * Actualiza la cantidad de un producto. Si la cantidad es 0 o menor, elimina el ítem.
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
    }
  }

  /**
   * Elimina un producto específico del carrito.
   */
  public removeItem(productId: string): void {
    const updatedItems = this.items.filter(item => item.product._id !== productId);
    this.saveCart(updatedItems);
  }

  /**
   * Vacía completamente el carrito y limpia el localStorage.
   */
  public clearCart(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.itemsSubject.next([]);
  }

  /**
   * Reemplaza todos los elementos del carrito (útil tras la sincronización con el servidor).
   */
  public setItems(items: CartItem[]): void {
    this.saveCart(items);
  }
}
