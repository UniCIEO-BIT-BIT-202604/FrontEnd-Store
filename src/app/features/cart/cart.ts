import { Component, inject } from '@angular/core';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faPlus, faMinus, faShoppingBag, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { HttpCartStore } from '../../core/services/http-cart-store';
import { CartItem } from '../../core/models/Cart';
import { Product } from '../../core/models/Product';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, RouterLink, FontAwesomeModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export default class CartComponent {
  public httpCartStore = inject(HttpCartStore);
  private router = inject(Router);
  public serverHostUrl: string = environment.serverHostUrl;

  // ICONOS
  faTrash = faTrash;
  faPlus = faPlus;
  faMinus = faMinus;
  faShoppingBag = faShoppingBag;
  faArrowLeft = faArrowLeft;

  getMainImageUrl(product: Product): string {
    if (!product.images || product.images.length === 0) {
      return 'assets/images/placeholder.png';
    }
    const mainImg = product.images.find((img) => img.isMain) || product.images[0];
    return `${this.serverHostUrl}${mainImg.url.startsWith('/') ? mainImg.url.slice(1) : mainImg.url}`;
  }

  increaseQuantity(item: CartItem): void {
    if (item.product._id && item.quantity < item.product.stock) {
      this.httpCartStore.updateQuantity(item.product._id, item.quantity + 1);
    }
  }

  decreaseQuantity(item: CartItem): void {
    if (item.product._id) {
      this.httpCartStore.updateQuantity(item.product._id, item.quantity - 1);
    }
  }

  removeItem(productId: string | undefined): void {
    if (productId) {
      this.httpCartStore.removeItem(productId);
    }
  }

  clearCart(): void {
    if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      this.httpCartStore.clearCart();
    }
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
