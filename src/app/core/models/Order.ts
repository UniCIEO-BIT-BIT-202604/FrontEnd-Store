import { Product } from './Product';
import { User } from './Users';

export interface OrderItem {
  product: Product | string;
  name: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  address: string;
  city: string;
  phone: string;
  notes?: string;
}

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentMethod = 'MOCK_CARD' | 'CASH_ON_DELIVERY' | 'WOMPI' | 'PAYPAL';

export interface Order {
  _id?: string;
  user: User | string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderPayload {
  shippingAddress: ShippingAddress;
  paymentMethod?: PaymentMethod;
  items?: Array<{
    product: string;
    quantity: number;
  }>;
}

export interface OrderResponse {
  msg: string;
  data: Order;
}

export interface OrderListResponse {
  msg: string;
  data: Order[];
}
