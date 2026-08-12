import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpRoles } from '../../../core/services/http-roles';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { HttpUsers } from '../../../core/services/http-users';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-new-form',
  imports: [ReactiveFormsModule, AsyncPipe, JsonPipe],
  templateUrl: './user-new-form.html',
  styleUrl: './user-new-form.css',
})
export default class UserNewForm {
  private httpRoles = inject(HttpRoles);
  private httpUsers = inject(HttpUsers);
  private router = inject(Router);

  roleList$ = new BehaviorSubject<any[]>([]);    // RxJS: Observables
  formData: FormGroup;

  selectedFile: File | null = null;   // Propiedad para almacenar el archivo seleccionado (si el usuario decide subir uno)

  constructor() {
    // Define la estructura equivalente del formulario en HTML incluyendo el validador de coincidencia de claves
    this.formData = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
      nickname: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      status: new FormControl(true),
      role: new FormControl('subscriber', [Validators.required])
    }, { validators: this.passwordMatchValidator });
  }

  /**
   * Validador personalizado a nivel de FormGroup para verificar que la contraseña y su confirmación sean idénticas
   */
  private passwordMatchValidator(group: any) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // Hook: Permite realizar tareas cuando el componente se esta inicializado
  ngOnInit() {
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

  /**
   * Captura el archivo seleccionado en el input de tipo file
   */
  onFileSelected(event: Event): void {
    // Hacemos un cast del evento para poder acceder a la propiedad files. 
    // Se accede a la lista de archivos seleccionados (files) y se toma el primer archivo
    const input = event.target as HTMLInputElement;

    // Si se selecciono al menos un archivo
    if (input.files && input.files.length > 0) {
      // Asignamos a la variable seleccionFile el primer archivo de la lista
      this.selectedFile = input.files[0];
      console.log(this.selectedFile);
    }
    // Si no se selecciona ningún archivo
    else {
      this.selectedFile = null;
    }
  }

  onSubmit() {
    // Verificar si el formulario es invalido
    if (this.formData.invalid) {
      // Muestro los valores
      console.log(this.formData.value);

      this.formData.markAllAsTouched();   // Marca como tocado todos los campos del formulario

      return;   // Detiene la ejecución del método onSubmit
    }

    // 1. Extraer confirmPassword separándolo mediante destructuración para enviarle al BackEnd únicamente las propiedades esperadas por la base de datos
    const { confirmPassword, ...userPayload } = this.formData.value;

    const payload = new FormData();

    // Iterar únicamente las propiedades del usuario excluyendo confirmPassword
    Object.entries(userPayload).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        payload.append(key, typeof value === 'boolean' ? String(value) : value as any);
      }
    });

    // 2. Solo adjuntar el archivo binario de la imagen si el usuario seleccionó uno
    if (this.selectedFile) {
      // Reemplaza o añade la propiedad 'avatarUrl' con el archivo File binario real
      payload.set('avatarUrl', this.selectedFile);
    }

    // 3. Enviar al servidor
    this.httpUsers.createUser(payload).subscribe({
      next: (response) => {
        console.log('Usuario registrado con éxito:', response);
        // Redireccionar a la lista de usuarios
        this.router.navigateByUrl('/user/list');
      },
      error: (error) => {
        console.error('Error al registrar usuario:', error);
      }
    });

  }
}
