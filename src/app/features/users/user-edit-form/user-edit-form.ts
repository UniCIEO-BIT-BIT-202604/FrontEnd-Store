import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpRoles } from '../../../core/services/http-roles';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { HttpUsers } from '../../../core/services/http-users';

// (SweetAlert2 - Paso 1: Importacion de la libreria en el componente)
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-edit-form',
  imports: [ReactiveFormsModule, AsyncPipe, JsonPipe, RouterLink],
  templateUrl: './user-edit-form.html',
  styleUrl: './user-edit-form.css',
})
export default class UserEditForm {
  selectedId!: string | null;    // Evita que TypeScript me obligue a definir el valor del atributo

  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  roleList$ = new BehaviorSubject<any[]>([]);    // RxJS: Observables

  formData: FormGroup;

  private httpRoles = inject(HttpRoles);
  private httpUsers = inject(HttpUsers);

  constructor() {
    // Define la estructura equivalente del formulario en HTML
    this.formData = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
      nickname: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      status: new FormControl(true),
      role: new FormControl('subscriber', [Validators.required]),
      avatar: new FormControl('')
    });
  }

  ngOnInit() {
    // Obtener el ID que se encuentra en la URL (Solamente cuando el formulario de editar es un componente de pagina)
    this.selectedId = this.activatedRoute.snapshot.paramMap.get('id');

    // Obtiene los datos del usuario para llenar el formulario usando el ID de la URL
    this.getDataFillForm();

    // Obtiene todos los roles disponibles en el sistema para desplegarlos en un selector en el formulario
    this.getRoles();
  }

  private getDataFillForm() {
    // Consulta para traer los datos del usuario por el ID que se obtiene de la RUL
    this.httpUsers.getUserById(this.selectedId).subscribe({
      next: (data) => {
        console.log(data);

        // Desestrucurar solo los datos que vamos a usar para llenar el formulario
        // const { name, nickname, email, status, role, avatar } = data.data;

        const { data: { name, nickname, email, status, role, avatar } } = data;

        // Llenar los campos del formulario con los datos obtenidos por el ID de la URL
        this.formData.patchValue({
          name,
          nickname,
          email,
          status,
          role,
          avatar
        });
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        console.log('Obtiene los datos del ID que se encuentra en ruta')
      }
    });
  }

  private getRoles() {
    // Observables
    this.httpRoles.getRoles().subscribe({
      next: (roles) => {
        console.log(roles);
        // Asigno los datos obtenidos del API a una propiedad que mantiene los datos en "memoria" del componente
        this.roleList$.next(roles.data);
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        console.log('Complete siempre se ejecuta')
      }
    });
  }

  onSubmit() {

    // Validar que el formulario (y sus campos) sean validos
    if (this.formData.valid) {
      console.log(this.formData.value);

      // (SweetAlert2 - Paso 2: Implementacion de la ventana Modal de SweetAlert2)
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, edit it!"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Edit!",
            text: "Your file has been edited.",
            icon: "success"
          });

          // Ejecutar el Servicio que me permite actualizar los datos que se encuentran resgistrados en el formulario
          this.httpUsers.updateUserById(this.selectedId, this.formData.value).subscribe({
            next: (data) => {
              console.log(data);
              this.router.navigate(['/dashboard/users']);
            },
            error: (err) => {
              console.error(err);
            },
            complete: () => {
              console.log('Actualiza usuario');
            }
          });

        }   // --> SweetAlert2
      });   // --> SweetAlert2

    }
    else {
      console.log('Formulario invalido');
    }

  }
}
