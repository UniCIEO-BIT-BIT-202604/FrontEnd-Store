import { Product } from './Product';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  _id?: string;
  user?: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  updatedAt?: string;
}

export interface SyncCartItemPayload {
  product: string; // ID del producto
  quantity: number;
}

export interface SyncCartPayload {
  items: SyncCartItemPayload[];
}

export interface CartResponse {
  msg: string;
  data: Cart;
}
