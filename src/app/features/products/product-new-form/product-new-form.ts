import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { HttpCategory } from '../../../core/services/http-category';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { HttpProducts } from '../../../core/services/http-products';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-new-form',
  imports: [ReactiveFormsModule, AsyncPipe, JsonPipe],
  templateUrl: './product-new-form.html',
  styleUrl: './product-new-form.css',
})
export default class ProductNewForm {
  categoryList$ = new BehaviorSubject<any>([]);
  private httpCategory = inject( HttpCategory );    // Inyectamos una Dependencia (para obtener el listad del categorias)
  private httpProducts = inject( HttpProducts );    // Inyectamos una Dependencia para registrar producto
  private router = inject( Router );

  formData!: FormGroup;

  constructor() {
    this.formData = new FormGroup({
      referenceCode: new FormControl( '', [ Validators.required ] ),
      name: new FormControl( '', [ Validators.required, Validators.minLength( 3 ) ] ),
      description: new FormControl(),
      price: new FormControl( 0, [ Validators.min( 0 ) ] ),
      stock: new FormControl( 1, [ Validators.min( 1 ) ]),
      category: new FormControl( '', [ Validators.required ] ),
      status: new FormControl(true)
    });
  }

  // Hook del ciclo del vida del componente donde podemos detectar cuando este se esta inicializando, con intención de programar acciones en este punto
  ngOnInit() {
    // Haga la consulta a la API, trayendo todas las categorias registradas en la BD
    this.httpCategory.getCategories().subscribe({
      next: ( data ) => {
        console.log( data );
        this.categoryList$.next( data.data );   // Asigna el listado de categorias al Observable que desplegara los datos en el FrontEnd del Componente
      },
      error: ( err ) => {
        console.error( err );
      },
      complete: () => {
        console.log( 'Obtiene todas las categorias registradas en el API' );
      }
    });
  }

  onSubmit() {

    // Verificando si el formulario es valido
    if( this.formData.valid ) {
      console.log( this.formData.value );   // Muestra todos los valores del formulario

      this.httpProducts.createProduct( this.formData.value ).subscribe({
        next: ( data ) => {
          console.log( data );
          this.formData.reset();    // Limpia los campos del formulario
          this.router.navigateByUrl( '/product/list' )  // Redirecciono
        },
        error: ( err ) => {
          console.error( err );
        },
        complete: () => {
          console.log( 'Registra un producto' );
        }
      });
    }
    else {
      console.log( 'El formulario no es valido' );
    }

  }

  // Getters
  get referenceCode() {
    return this.formData.get( 'referenceCode' );
  }
  get name() {
    return this.formData.get( 'name' );
  }

}
