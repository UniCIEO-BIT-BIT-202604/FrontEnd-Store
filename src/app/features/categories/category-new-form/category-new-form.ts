import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { HttpCategory } from '../../../core/services/http-category';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './category-new-form.html',
  styleUrl: './category-new-form.css',
})
export default class CategoryNewForm {
  private httpCategory = inject( HttpCategory );
  private router = inject( Router );

  formData!: FormGroup;

  constructor() {
    this.formData = new FormGroup({
      name: new FormControl( '', [ Validators.required, Validators.minLength( 5 ) ] ),
      description: new FormControl(),
      urlImage: new FormControl(),
      status: new FormControl(true)
    });
  }

  onSubmit() {

    // Verificando si el formulario es valido
    if( this.formData.valid ) {
      console.log( this.formData.value );   // Muestra todos los valores del formulario

      this.httpCategory.createCategory( this.formData.value ).subscribe({
        next: ( data ) => {
          console.log( data );
          this.router.navigateByUrl( '/category/list' );    // Redireccionar
        },
        error: ( err ) => {
          console.error( err );
        },
        complete: () => {
          console.log( 'Registra Categoria' );
        }
      });
    }
    else {
      console.log( 'El formulario no es valido' );
    }

  }

  // Getters
  get name() {
    return this.formData.get( 'name' );
  }

}
