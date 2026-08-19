import { ChangeDetectorRef, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { HttpRoles } from '../../../core/services/http-roles';
import { BehaviorSubject } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { HttpUsers } from '../../../core/services/http-users';
import { HttpAuth } from '../../../core/services/http-auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ ReactiveFormsModule, AsyncPipe, JsonPipe, RouterLink ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export default class Register {
  // Referencias a los elementos <dialog> nativos de HTML usando @ViewChild
  @ViewChild('errorModal') errorModal!: ElementRef<HTMLDialogElement>;
  @ViewChild('successModal') successModal!: ElementRef<HTMLDialogElement>;

  private httpRoles = inject( HttpRoles );
  private httpUsers = inject( HttpUsers );
  private httpAuth = inject( HttpAuth );
  private router = inject( Router );
  private cdr = inject( ChangeDetectorRef ); // Inyección de ChangeDetectorRef para forzar renderizado de bindings en los modales

  roleList$ = new BehaviorSubject<any[]>([]);    // RxJS: Observables
  formData: FormGroup;
  errorMessage: string = '';                   // Almacena el mensaje de error para el modal de error
  successUser: string = '';                    // Almacena el nombre del usuario registrado para el modal de éxito

  constructor() {
    // Define la estructura equivalente del formulario en HTML
    this.formData = new FormGroup({
      name: new FormControl( '', [ Validators.required, Validators.minLength(2), Validators.maxLength(50) ] ),
      nickname: new FormControl( '', [ Validators.required, Validators.minLength(3), Validators.maxLength(20)] ),
      email: new FormControl( '', [ Validators.required, Validators.email ] ),
      password: new FormControl( '', [ Validators.required] ),
      confirmPassword: new FormControl( '', [ Validators.required] ),
      status: new FormControl( true ),
      role: new FormControl( 'subscriber', [ Validators.required] )
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(group: any) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.formData.valid) {
      // Capturar el nombre del usuario antes de reiniciar el formulario
      const registeredName = this.formData.get('name')?.value || 'Usuario';
      const { confirmPassword, ...userPayload } = this.formData.value;

      // Asegurar que el rol sea el perfil más bajo por defecto ('subscriber')
      userPayload.role = 'subscriber';

      this.httpAuth.registerUser(userPayload).subscribe({
        next: (res) => {
          console.log('Usuario registrado públicamente con perfil subscriptor:', res);

          // Asignar el nombre del usuario registrado para personalizar la felicitación
          this.successUser = registeredName;

          // Limpiar los campos del formulario tras el registro exitoso
          this.formData.reset();

          // Forzar la actualización del DOM para vincular el nombre en el modal
          this.cdr.detectChanges();

          // Abrir la ventana modal de éxito
          this.openSuccessModal();

          // Mantener la ventana modal durante 3 segundos antes de redirigir a la pantalla de login
          setTimeout(() => {
            this.closeSuccessModal();                       // Cerrar la modal de éxito
            this.router.navigateByUrl('/login');            // Redirigir al usuario a iniciar sesión
          }, 3000);
        },
        error: (err) => {
          console.error('Error en el registro público:', err);

          // Extraer el mensaje enviado específicamente por el backend dentro de err.error
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

          // Asignar el mensaje del backend o el mensaje predeterminado si viene vacío
          this.errorMessage = (extractedMsg && extractedMsg.trim() !== '')
            ? extractedMsg
            : 'Error al registrar el usuario. Por favor verifica tus datos e intenta nuevamente.';

          // Forzar la detección de cambios para actualizar {{ errorMessage }} en el modal
          this.cdr.detectChanges();

          // Abrir la ventana modal de error
          this.openErrorModal();
        }
      });
    } else {
      this.formData.markAllAsTouched();
    }
  }

  // Métodos auxiliares para abrir y cerrar el modal de error
  openErrorModal(): void {
    if (this.errorModal?.nativeElement) {
      this.errorModal.nativeElement.showModal(); // Muestra el modal de error como cuadro de diálogo flotante modal
    }
  }

  closeErrorModal(): void {
    if (this.errorModal?.nativeElement) {
      this.errorModal.nativeElement.close();     // Cierra el modal de error
    }
  }

  // Métodos auxiliares para abrir y cerrar el modal de éxito
  openSuccessModal(): void {
    if (this.successModal?.nativeElement) {
      this.successModal.nativeElement.showModal(); // Muestra el modal de éxito como cuadro de diálogo flotante modal
    }
  }

  closeSuccessModal(): void {
    if (this.successModal?.nativeElement) {
      this.successModal.nativeElement.close();    // Cierra el modal de éxito
    }
  }

  // Hook: Permite realizar tareas cuando el componente se está inicializando
  ngOnInit() {
    // Observables
    this.httpRoles.getRoles().subscribe({
      next: ( roles ) => {
        console.log( roles );
        // Asigno los datos obtenidos del API a una propiedad que mantiene los datos en "memoria" del componente
        this.roleList$.next(roles.data);
      },
      error: ( err ) => {
        console.error( err );
      },
      complete: () => {
        console.log( 'Complete siempre se ejecuta' )
      }
    });
  }

}

