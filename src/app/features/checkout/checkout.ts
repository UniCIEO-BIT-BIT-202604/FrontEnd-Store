import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCreditCard, faMoneyBill1Wave, faLock, faArrowLeft, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { CartService } from '../../core/services/cart.service';
import { HttpOrders } from '../../core/services/http-orders';
import { HttpAuth } from '../../core/services/http-auth';
import { CreateOrderPayload, PaymentMethod } from '../../core/models/Order';
import { Product } from '../../core/models/Product';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, CurrencyPipe, RouterLink, FontAwesomeModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export default class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public cartService = inject(CartService);
  private httpOrders = inject(HttpOrders);
  private httpAuth = inject(HttpAuth);

  public serverHostUrl: string = environment.serverHostUrl;
  public checkoutForm!: FormGroup;
  public isSubmitting: boolean = false;
  public errorMessage: string = '';

  // ICONOS
  faCreditCard = faCreditCard;
  faMoneyBill1Wave = faMoneyBill1Wave;
  faLock = faLock;
  faArrowLeft = faArrowLeft;
  faCheckCircle = faCheckCircle;

  ngOnInit(): void {
    // 1. Verificar autenticación. Si no está logueado, redirigir a login
    if (!this.httpAuth.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }

    // 2. Si el carrito está vacío, redirigir al carrito
    if (this.cartService.items.length === 0) {
      this.router.navigate(['/cart']);
      return;
    }

    // 3. Inicializar el formulario reactivo
    this.checkoutForm = this.fb.group({
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+ \-]{7,15}$/)]],
      notes: [''],
      paymentMethod: ['MOCK_CARD', [Validators.required]]
    });
  }

  getMainImageUrl(product: Product): string {
    if (!product.images || product.images.length === 0) {
      return 'assets/images/placeholder.png';
    }
    const mainImg = product.images.find((img) => img.isMain) || product.images[0];
    return `${this.serverHostUrl}${mainImg.url.startsWith('/') ? mainImg.url.slice(1) : mainImg.url}`;
  }

  selectPaymentMethod(method: PaymentMethod): void {
    this.checkoutForm.patchValue({ paymentMethod: method });
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValues = this.checkoutForm.value;

    const payload: CreateOrderPayload = {
      shippingAddress: {
        address: formValues.address,
        city: formValues.city,
        phone: formValues.phone,
        notes: formValues.notes
      },
      paymentMethod: formValues.paymentMethod
    };

    this.httpOrders.createOrder(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        // Limpiar el carrito local tras la compra exitosa
        this.cartService.clearCart();
        // Redirigir a la vista de órdenes/confirmación
        this.router.navigate(['/orders'], { queryParams: { success: 'true', orderId: res.data._id } });
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error al procesar la orden:', err);
        this.errorMessage = err.error?.msg || 'Ocurrió un error al procesar el pago y la orden de compra';
      }
    });
  }
}
