import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpCategory } from '../../../core/services/http-category';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';

// (--1--) Importamos la libreria de icinos de Hugeicons
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { BadgeXIcon, Notification03Icon } from '@hugeicons/core-free-icons';

@Component({
  selector: 'app-category-list',
  imports: [RouterLink, AsyncPipe, JsonPipe, HugeiconsIconComponent],   // (--2--) Importar libreria al componente
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export default class CategoryList {
  categoryList$ = new BehaviorSubject<any>([]);

  // (--3--) Definen el atributo publico que desplegara el icono
  notificationIcon = Notification03Icon;
  badgeXIcon = BadgeXIcon;

  // (0) Siempre inyectar la dependencia
  private httpCategory = inject( HttpCategory );


  // Hook: Reconoce cuando se inicializa el componente
  ngOnInit() {
    // Obtener el listado de categorias usando el Servicio
    this.httpCategory.getCategories().subscribe({
      next: ( data ) => {
        console.log( data.data );
        this.categoryList$.next( data.data );   // Guarda los datos dentro de un Observable creado por el BehaviorSubject para desplegar los datos en el FrontEnd del Component (HTML)
      },
      error: ( err ) => {
        console.error( err );
      },
      complete: () => {
        console.log( 'Listar categorias' );
      }
    });
  }
}
