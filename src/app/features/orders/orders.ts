import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBox, faCheckCircle, faClock, faTruck, faTimesCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { HttpOrders } from '../../core/services/http-orders';
import { HttpAuth } from '../../core/services/http-auth';
import { Order } from '../../core/models/Order';
import { Product } from '../../core/models/Product';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, NgClass, RouterLink, FontAwesomeModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export default class OrderListComponent implements OnInit {
  private httpOrders = inject(HttpOrders);
  private httpAuth = inject(HttpAuth);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public orders: Order[] = [];
  public isLoading: boolean = true;
  public errorMessage: string = '';
  public showSuccessBanner: boolean = false;
  public serverHostUrl: string = environment.serverHostUrl;

  // ICONOS
  faBox = faBox;
  faCheckCircle = faCheckCircle;
  faClock = faClock;
  faTruck = faTruck;
  faTimesCircle = faTimesCircle;
  faArrowLeft = faArrowLeft;

  ngOnInit(): void {
    // 1. Verificar si el usuario está autenticado. Si no lo está, redirigir al login
    if (!this.httpAuth.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/orders' } });
      return;
    }

    this.route.queryParams.subscribe(params => {
      if (params['success'] === 'true') {
        this.showSuccessBanner = true;
      }
    });

    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.httpOrders.getUserOrders().subscribe({
      next: (res) => {
        console.log('[Respuesta Órdenes]:', res);
        this.orders = res?.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar órdenes:', err);
        this.isLoading = false;
        this.errorMessage = err.error?.msg || 'No se pudieron cargar las órdenes de compra.';
      }
    });
  }

  getProductImage(product: Product | string): string {
    if (typeof product === 'object' && product && product.images && product.images.length > 0) {
      const mainImg = product.images.find(i => i.isMain) || product.images[0];
      return `${this.serverHostUrl}${mainImg.url.startsWith('/') ? mainImg.url.slice(1) : mainImg.url}`;
    }
    return 'assets/images/placeholder.png';
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PAID': return 'badge-paid';
      case 'PENDING': return 'badge-pending';
      case 'SHIPPED': return 'badge-shipped';
      case 'DELIVERED': return 'badge-delivered';
      case 'CANCELLED': return 'badge-cancelled';
      default: return 'badge-default';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'PAID': return 'Pagado';
      case 'PENDING': return 'Pendiente de Pago';
      case 'SHIPPED': return 'Enviado';
      case 'DELIVERED': return 'Entregado';
      case 'CANCELLED': return 'Cancelado';
      default: return status;
    }
  }
}
