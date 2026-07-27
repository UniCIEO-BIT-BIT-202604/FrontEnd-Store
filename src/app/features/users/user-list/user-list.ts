import { Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Router, RouterLink } from "@angular/router";
import { BehaviorSubject, Subscription } from 'rxjs';

import Swal from 'sweetalert2';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee, faPen, faUser } from '@fortawesome/free-solid-svg-icons';

import { HttpUsers } from '../../../core/services/http-users';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-user-list',
  imports: [AsyncPipe, JsonPipe, RouterLink, FontAwesomeModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export default class UserList {
  // Atributos de la logica del componente
  subscriberUser!: Subscription;    // ! Pase por alto que 'subscriberUser' sea definido como un valor undefined
  subscriberDeleteUser!: Subscription;

  public userList$ = new BehaviorSubject<any>([]);

  serverHostUrl: string = environment.serverHostUrl;
  defaultAvatarUrl: string = environment.defaultAvatarUrl;
  defaultUIAvatarAPI: string = environment.defaultUIAvatarAPI;

  private httpUsers = inject(HttpUsers);
  private router = inject(Router);

  // Atributos de iconos con Fontawesome
  faCoffee = faCoffee;
  faPen = faPen;
  faUser = faUser;

  // Hook: Saber cuando se inicializa el componente
  ngOnInit() {
    this.loadUsers();
  }

  ngOnDestroy() {
    // Verifico si existe una subscripción activa y la desubscribo
    if (this.subscriberUser) {
      this.subscriberUser.unsubscribe();
    }
    if (this.subscriberDeleteUser) {
      this.subscriberDeleteUser.unsubscribe();
    }
  }

  private loadUsers() {
    // Realizar la peticion de los datos de la API para que sean obtenidos antes que el componente cargue (visualmente)
    // Guarda la subscripcion al Observable para tener control del mismo
    this.subscriberUser = this.httpUsers.getUsers().subscribe({
      next: (res) => {
        console.log(res);
        // Asignar la lista de usuarios al observable
        this.userList$.next(res.data || res);   // Solo la lista de los usuarios
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        console.log('Lista todos los usuarios');
      }
    });
  }

  onEdit(id: string) {
    console.log('Edit', id);
    // Redirecciona
    // this.router.navigateByUrl( `/user/edit/${id}` )
    this.router.navigate(['/user', 'edit', id]);
  }

  onDelete(id: string) {

    // Implementa la ventana emergente con SweetAlert2
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {

      if (result.isConfirmed) {

        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });

        // console.log( 'Delete', id );
        // Guarda la subscripcion al Observable para tener control del mismo
        this.subscriberDeleteUser = this.httpUsers.deleteUserById(id).subscribe({
          next: (data) => {
            console.log(data);
            this.loadUsers();      // Ejecutar
          },
          error: (err) => {
            console.error(err);
          },
          complete: () => {
            console.log('Peticion al API para eliminar usuario por ID');
          }
        });
      }



    });
  }
}
