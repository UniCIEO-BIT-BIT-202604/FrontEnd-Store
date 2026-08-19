import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { HttpProducts } from '../../core/services/http-products';
import { HttpCartStore } from '../../core/services/http-cart-store';
import { Product } from '../../core/models/Product';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, FontAwesomeModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export class Home implements OnInit {
  productList$ = new BehaviorSubject<Product[]>([]);
  serverHostUrl: string = environment.serverHostUrl;

  faHeart = faHeart;
  faShoppingCart = faShoppingCart;

  private httpProducts = inject(HttpProducts);
  private httpCartStore = inject(HttpCartStore);

  ngOnInit(): void {
    this.loadActiveProducts();
  }

  loadActiveProducts(): void {
    this.httpProducts.getProducts().subscribe({
      next: (res) => {
        // Filtrar solo los productos activos que tengan stock disponible
        const activeProducts = (res.data || []).filter(
          (product) => product.status === true && product.stock > 0
        );
        this.productList$.next(activeProducts);
      },
      error: (err) => {
        console.error('Error al obtener productos:', err);
      },
    });
  }

  getMainImageUrl(product: Product): string {
    if (!product.images || product.images.length === 0) {
      return 'assets/images/placeholder.png';
    }
    const mainImg = product.images.find((img) => img.isMain) || product.images[0];
    return `${this.serverHostUrl}${mainImg.url.startsWith('/') ? mainImg.url.slice(1) : mainImg.url}`;
  }

  toggleFavorite(product: Product): void {
    // Futura funcionalidad: Favoritos
    console.log('Favorito:', product);
  }

  addToCart(product: Product): void {
    this.httpCartStore.addItem(product, 1);
  }
}
