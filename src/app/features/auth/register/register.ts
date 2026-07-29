import { Component, inject } from '@angular/core';
import { HttpRoles } from '../../../core/services/http-roles';
import { BehaviorSubject } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [ ReactiveFormsModule, AsyncPipe, JsonPipe ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export default class Register {
  private httpRoles = inject( HttpRoles );

  //
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
      role: new FormControl( 'subscriber', [ Validators.required] ),
      avatar: new FormControl( '' )
    });
  }

  onSubmit() {

    console.group( 'Estados del campos del formulario' );
    console.log( 'valid (formData)', this.formData.valid );
    console.log( 'valid (name)', this.formData.get( 'name' )?.valid );
    console.log( 'valid (email)', this.formData.get( 'email' )?.valid );
    console.groupEnd;

    // Verificar si el formulario es valido
    if( this.formData.valid ) {
      // Muestro los vaalores
      console.log( this.formData.value );
    }
    else {
      console.log( 'Formulario invalido' );
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
