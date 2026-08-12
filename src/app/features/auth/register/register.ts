import { Component, inject } from '@angular/core';
import { HttpRoles } from '../../../core/services/http-roles';
import { BehaviorSubject } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { HttpUsers } from '../../../core/services/http-users';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ ReactiveFormsModule, AsyncPipe, JsonPipe ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export default class Register {
  private httpRoles = inject( HttpRoles );
  private httpUsers = inject( HttpUsers );
  private router = inject( Router );

  roleList$ = new BehaviorSubject<any[]>([]);    // RxJS: Observables
  formData: FormGroup;

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
      const { confirmPassword, ...userPayload } = this.formData.value;

      // Asegurar que el rol sea el perfil más bajo por defecto ('subscriber')
      userPayload.role = 'subscriber';

      this.httpUsers.createUser(userPayload).subscribe({
        next: (res) => {
          console.log('Usuario registrado públicamente con perfil subscriptor:', res);
          this.router.navigateByUrl('/login');
        },
        error: (err) => {
          console.error('Error en el registro público:', err);
        }
      });
    } else {
      this.formData.markAllAsTouched();
    }
  }

  // Hook: Permite realizar tareas cuando el componente se esta inicializado
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
