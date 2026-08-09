import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpCategory } from '../../../core/services/http-category';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-new-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './category-new-form.html',
  styleUrl: './category-new-form.css',
})
export default class CategoryNewForm {
  private httpCategory = inject(HttpCategory);
  private router = inject(Router);

  formData: FormGroup;

  constructor() {
    this.formData = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(5)]),
      slug: new FormControl(''),
      description: new FormControl(''),
      urlImage: new FormControl(''),
      status: new FormControl(true)
    });
  }

  onSubmit(): void {
    if (this.formData.invalid) {
      this.formData.markAllAsTouched();
      return;
    }

    this.httpCategory.createCategory(this.formData.value).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Categoría Creada!',
          text: 'La categoría se registró exitosamente.',
          timer: 1500,
          showConfirmButton: false
        });
        this.router.navigateByUrl('/category/list');
      },
      error: (err) => {
        console.error(err);
        const msg = err.error?.msg || 'No se pudo registrar la categoría';
        Swal.fire('Error', msg, 'error');
      }
    });
  }

  get name() {
    return this.formData.get('name');
  }
}
