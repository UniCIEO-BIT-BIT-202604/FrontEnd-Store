import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-new-form.html',
  styleUrl: './user-new-form.css',
})
export class UserNewForm {
  formData: FormGroup;

  constructor() {
    // Define la estructura equivalente del formulario en HTML
    this.formData = new FormGroup({
      name: new FormControl(),
      nickname: new FormControl(),
      email: new FormControl(),
      password: new FormControl(),
      status: new FormControl(),
      role: new FormControl(),
      avatar: new FormControl()
    });
  }

  onSubmit() {
    // Muestro los vaalores
    console.log( this.formData.value );
  }

}
