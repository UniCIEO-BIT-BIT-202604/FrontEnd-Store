import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpRoles } from '../../../core/services/http-roles';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { HttpUsers } from '../../../core/services/http-users';
import { environment } from '../../../../environments/environment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-edit-form',
  imports: [ReactiveFormsModule, AsyncPipe, JsonPipe, RouterLink, FontAwesomeModule],
  templateUrl: './user-edit-form.html',
  styleUrl: './user-edit-form.css',
})
export default class UserEditForm {
  selectedId!: string | null;
  currentAvatarUrl: string | null = null;
  selectedFile: File | null = null;
  resetAvatarFlag: boolean = false;

  // Variables de entorno para avatares
  serverHostUrl: string = environment.serverHostUrl;
  defaultAvatarUrl: string = environment.defaultAvatarUrl;
  defaultUIAvatarAPI: string = environment.defaultUIAvatarAPI;

  faUser = faUser;

  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private httpRoles = inject(HttpRoles);
  private httpUsers = inject(HttpUsers);

  roleList$ = new BehaviorSubject<any[]>([]);
  formData: FormGroup;

  constructor() {
    this.formData = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
      nickname: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl(''),
      confirmPassword: new FormControl(''),
      status: new FormControl(true),
      role: new FormControl('subscriber', [Validators.required])
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    if (password || confirmPassword) {
      return password === confirmPassword ? null : { passwordMismatch: true };
    }
    return null;
  }

  ngOnInit() {
    this.selectedId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getDataFillForm();
    this.getRoles();
  }

  private getDataFillForm() {
    this.httpUsers.getUserById(this.selectedId).subscribe({
      next: (res) => {
        const user = res.data || res;
        this.currentAvatarUrl = user.avatarUrl || user.avatar || null;

        this.formData.patchValue({
          name: user.name,
          nickname: user.nickname,
          email: user.email,
          status: user.status,
          role: user.role
        });
      },
      error: (err) => console.error(err)
    });
  }

  private getRoles() {
    this.httpRoles.getRoles().subscribe({
      next: (roles) => this.roleList$.next(roles.data),
      error: (err) => console.error(err)
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.resetAvatarFlag = false;
    } else {
      this.selectedFile = null;
    }
  }

  onRemoveAvatar(): void {
    this.selectedFile = null;
    this.resetAvatarFlag = true;
    this.currentAvatarUrl = this.defaultAvatarUrl;
  }

  onSubmit() {
    if (this.formData.invalid) {
      this.formData.markAllAsTouched();
      return;
    }

    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Vas a actualizar los datos de este usuario!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, actualizar!"
    }).then((result) => {
      if (result.isConfirmed) {
        const { confirmPassword, ...userPayload } = this.formData.value;

        // Si la contraseña se dejó vacía al editar, la omitimos para no sobreescribirla
        if (!userPayload.password) {
          delete userPayload.password;
        }

        const payload = new FormData();
        Object.entries(userPayload).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            payload.append(key, value as any);
          }
        });

        // 1. Si se seleccionó una nueva imagen binaria
        if (this.selectedFile) {
          payload.set('avatarUrl', this.selectedFile);
        } 
        // 2. Si el usuario solicitó eliminar su foto actual para volver a la por defecto
        else if (this.resetAvatarFlag) {
          payload.set('avatarUrl', '');
        }

        this.httpUsers.updateUserById(this.selectedId, payload).subscribe({
          next: (data) => {
            Swal.fire({
              title: "¡Actualizado!",
              text: "El usuario ha sido actualizado con éxito.",
              icon: "success"
            });
            this.router.navigate(['/user', 'list']);
          },
          error: (err) => console.error(err)
        });
      }
    });
  }
}
