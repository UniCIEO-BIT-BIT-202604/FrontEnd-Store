import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { HttpAuth } from '../../../core/services/http-auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export default class Login {

  formData: FormGroup;
  private httpAuth = inject(HttpAuth);

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
      // Muestro los vaalores
      console.log(this.formData.value);

      // Usar el servicio para conectar con la API y verificar la autenticacion del usuario
      this.httpAuth.loginUser(this.formData.value).subscribe({
        next: (res) => {
          console.log(res);   // { msg: '...', data: { ... }, token: '...' }

          this.formData.reset();  // Limpiamos los campos del formulario
        },
        error: (err) => {
          console.error(err);
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


}
