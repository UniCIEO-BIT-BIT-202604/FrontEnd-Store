import { Component, inject } from '@angular/core';
import { HttpUsers } from '../../../core/services/http-users';

@Component({
  selector: 'app-user-list',
  imports: [],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList {


  // Inyectar una dependencia
  private httpUsers = inject( HttpUsers );

  // Hook del ciclo de vida de un compomente en Angular (Cuando se inicializa el componente)
  ngOnInit() {
    // Invocando la funcionalidad del Servicio - Obtiene todos los usuarios
    this.httpUsers.getUsers().subscribe({
      next: ( users ) => {
        console.log( 'componente', users );
        // this.users = data;      // Asignando los datos obtenidos del Servicio al atributo publico para mostrarlo en el HTML componente
      },
      error: ( err ) => {
        console.error( err );
      }
    });
  }
}
