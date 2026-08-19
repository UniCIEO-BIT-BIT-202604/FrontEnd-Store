import { ChangeDetectorRef, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { HttpAuth } from '../../../core/services/http-auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export default class Login {

  @ViewChild('errorModal') errorModal!: ElementRef<HTMLDialogElement>;
  @ViewChild('welcomeModal') welcomeModal!: ElementRef<HTMLDialogElement>;

  formData: FormGroup;
  private httpAuth = inject(HttpAuth);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);    // Inyecta ChangeDetectorRef para forzar la detección de cambios en los modales
  errorMessage: string = '';                  // almacena el mensaje de error
  welcomeUser: string = '';                   // almacena el nombre del usuario para el modal de bienvenida

  constructor() {
    // Define la estructura equivalente del formulario en HTML
    this.formData = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),

    });
  }

  onSubmit() {

    // Verificar si el formulario es valido
    if (this.formData.valid) {
      // Muestro los valores
      console.log(this.formData.value);

      // Usar el servicio para conectar con la API y verificar la autenticacion del usuario
      this.httpAuth.loginUser(this.formData.value).subscribe({
        next: (res) => {
          console.log(res);   // { msg: '...', data: { ... }, token: '...' }

          // Obtener nombre del usuario autenticado
          this.welcomeUser = this.httpAuth.user?.name || this.httpAuth.user?.nickname || 'Usuario';

          this.formData.reset();  // Limpiamos los campos del formulario
          this.cdr.detectChanges();
          this.openWelcomeModal(); // Desplegar modal de bienvenida

          // Mantener la modal visible durante 3 segundos antes de redirigir al Dashboard
          setTimeout(() => {
            this.closeWelcomeModal();
            this.router.navigateByUrl('/dashboard');
          }, 3000);
        },
        error: (err) => {
          console.error('Error de login capturado:', err);

          // Extrae el mensaje enviado específicamente por la API backend dentro de err.error
          let extractedMsg: string | null = null;

          if (typeof err === 'string') {
            extractedMsg = err;
          } else if (typeof err?.error === 'string') {
            extractedMsg = err.error;
          } else if (err?.error?.msg) {
            extractedMsg = err.error.msg;
          } else if (err?.error?.message) {
            extractedMsg = err.error.message;
          } else if (err?.msg) {
            extractedMsg = err.msg;
          }

          // Si el backend no envió un mensaje explicativo, se asigna el mensaje predeterminado
          this.errorMessage = (extractedMsg && extractedMsg.trim() !== '')
            ? extractedMsg
            : 'El usuario no existe, por favor regístrese';

          this.cdr.detectChanges();   // detectar cambios en el modal
          this.openModal();           // abrir el modal
        },
        complete: () => {
          console.log('Execute complete');
        }
      });

    }
    else {
      console.log('Formulario invalido');
    }
  }

  openModal(): void {
    // Validamos si el modal existe antes de abrirlo
    if (this.errorModal?.nativeElement) {
      this.errorModal.nativeElement.showModal();  // abrir el modal
    }
  }

  closeModal(): void {
    // Validamos si el modal existe antes de cerrarlo
    if (this.errorModal?.nativeElement) {
      this.errorModal.nativeElement.close();    // cerrar el modal
    }
  }

  openWelcomeModal(): void {
    if (this.welcomeModal?.nativeElement) {
      this.welcomeModal.nativeElement.showModal();
    }
  }

  closeWelcomeModal(): void {
    if (this.welcomeModal?.nativeElement) {
      this.welcomeModal.nativeElement.close();
    }
  }
}
