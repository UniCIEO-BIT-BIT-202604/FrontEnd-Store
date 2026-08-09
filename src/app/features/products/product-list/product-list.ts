import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpProducts } from '../../../core/services/http-products';
import { Product } from '../../../core/models/Product';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink, AsyncPipe, NgIf, NgFor, CurrencyPipe],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export default class ProductList implements OnInit {
  productList$ = new BehaviorSubject<Product[]>([]);
  serverHostUrl: string = environment.serverHostUrl;

  private httpProducts = inject(HttpProducts);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.httpProducts.getProducts().subscribe({
      next: (res) => {
        this.productList$.next(res.data);
      },
      error: (err) => {
        console.error('Error al obtener productos:', err);
      }
    });
  }

  typeofCategory(cat: any): string {
    if (!cat) return 'N/A';
    if (typeof cat === 'object' && cat.name) {
      return cat.name;
    }
    return cat;
  }

  getMainImageUrl(product: Product): string {
    if (!product.images || product.images.length === 0) {
      return 'assets/images/placeholder.png';
    }
    const mainImg = product.images.find(img => img.isMain) || product.images[0];
    return `${this.serverHostUrl}${mainImg.url.startsWith('/') ? mainImg.url.slice(1) : mainImg.url}`;
  }

  deleteProduct(id: string | undefined): void {
    if (!id) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se eliminará el producto y todas sus imágenes asociadas.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpProducts.deleteProduct(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El producto ha sido eliminado exitosamente.',
              timer: 1500,
              showConfirmButton: false
            });
            this.loadProducts();
          },
          error: (err) => {
            console.error('Error al eliminar producto:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el producto.'
            });
          }
        });
      }
    });
  }
}
