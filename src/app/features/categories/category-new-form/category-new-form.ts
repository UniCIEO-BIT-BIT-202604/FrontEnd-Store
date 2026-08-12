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
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  imageError: string | null = null;

  private httpCategory = inject(HttpCategory);
  private router = inject(Router);

  formData: FormGroup;

  constructor() {
    this.formData = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(5)]),
      slug: new FormControl(''),
      description: new FormControl(''),
      status: new FormControl(true)
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.imageError = null;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        this.imageError = 'Solo se admiten archivos de imagen.';
        this.selectedFile = null;
        this.previewUrl = null;
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        this.imageError = 'La imagen no puede superar los 2MB.';
        this.selectedFile = null;
        this.previewUrl = null;
        return;
      }

      this.selectedFile = file;
      this.previewUrl = URL.createObjectURL(file);
    } else {
      this.selectedFile = null;
      this.previewUrl = null;
    }
  }

  removePreview(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.imageError = null;
  }

  onSubmit(): void {
    if (this.formData.invalid) {
      this.formData.markAllAsTouched();
      return;
    }

    const payload = new FormData();
    Object.keys(this.formData.controls).forEach(key => {
      payload.append(key, this.formData.get(key)?.value);
    });

    if (this.selectedFile) {
      payload.append('urlImage', this.selectedFile);
    }

    this.httpCategory.createCategory(payload).subscribe({
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
