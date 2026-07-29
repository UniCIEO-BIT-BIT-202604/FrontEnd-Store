import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { HttpCategory } from '../../../core/services/http-category';

@Component({
  selector: 'app-category-edit-form',
  imports: [ReactiveFormsModule],
  templateUrl: './category-edit-form.html',
  styleUrl: './category-edit-form.css',
})
export default class CategoryEditForm {
  selectedId!: string | null;    // Atributo donde vamos a almacenar el ID del documento que vamos a editar
  formData!: FormGroup;

  private activatedRoute = inject( ActivatedRoute );
  private httpCategory = inject( HttpCategory );

  constructor() {
    this.formData = new FormGroup({
      name: new FormControl( '', [ Validators.required, Validators.minLength( 5 ) ] ),
      description: new FormControl(),
      urlImage: new FormControl(),
      status: new FormControl(true)
    });
  }

  ngOnInit() {
    // Obtener el ID de la ruta y lo guardamos en el atributo de clase
    this.selectedId = this.activatedRoute.snapshot.paramMap.get('id');
    // console.log( this.selectedId );

    // Consultar si el documento existe y lo traemos por si ID
    this.httpCategory.getCategoryById( this.selectedId ).subscribe({
      next: ( res ) => {
        console.log( res.data );

        const { name, description, urlImage, status } = res.data;

        // Actualizar los valores de los campos del formulario
        this.formData.patchValue({
          name,
          description,
          urlImage,
          status
        });

      },
      error: ( err ) => {
        console.error( err );
      },
      complete: () => {
        console.log( 'Execute Complete' );
      }
    });
  }

  onSubmit() {
    // Valida si el formulario es valido
    if( this.formData.valid ) {
      console.log( this.formData.value );

      // Enviamos los datos al servicio para que los envie a la API y actualice el documento
      this.httpCategory.updateCategoryById( this.selectedId, this.formData.value ).subscribe({
        next: ( res ) => {
          console.log( res );
        },
        error: ( err ) => {
          console.error( err );
        },
        complete: () => {
          console.log( 'Execute complete' );
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
