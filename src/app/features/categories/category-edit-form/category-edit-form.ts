import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpCategory } from '../../../core/services/http-category';
import { Category } from '../../../core/models/Category';
import { NgIf } from '@angular/common';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-edit-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './category-edit-form.html',
  styleUrl: './category-edit-form.css',
})
export default class CategoryEditForm implements OnInit {
  selectedId!: string | null;
  serverHostUrl: string = environment.serverHostUrl;
  currentUrlImage: string | null = null;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  resetImageFlag: boolean = false;
  imageError: string | null = null;

  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private httpCategory = inject(HttpCategory);

  formData: FormGroup;

  constructor() {
    this.formData = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(5)]),
      slug: new FormControl(''),
      description: new FormControl(''),
      status: new FormControl(true)
    });
  }

  ngOnInit(): void {
    this.selectedId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getCategoryData();
  }

  private getCategoryData(): void {
    this.httpCategory.getCategoryById(this.selectedId).subscribe({
      next: (res) => {
        const cat: Category = res.data;
        this.currentUrlImage = cat.urlImage || '/uploads/categories/default-category.png';

        this.formData.patchValue({
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          status: cat.status
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo obtener la categoría', 'error');
      }
    });
  }

  getImageUrl(): string {
    if (this.previewUrl) {
      return this.previewUrl;
    }
    if (this.currentUrlImage) {
      return `${this.serverHostUrl}${this.currentUrlImage.startsWith('/') ? this.currentUrlImage.slice(1) : this.currentUrlImage}`;
    }
    return `${this.serverHostUrl}uploads/categories/default-category.png`;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.imageError = null;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        this.imageError = 'Solo se admiten archivos de imagen.';
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        this.imageError = 'La imagen no puede superar 2MB.';
        return;
      }

      this.selectedFile = file;
      this.previewUrl = URL.createObjectURL(file);
      this.resetImageFlag = false;
      this.formData.markAsDirty();
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.resetImageFlag = true;
    this.currentUrlImage = '/uploads/categories/default-category.png';
    this.formData.markAsDirty();
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
    } else if (this.resetImageFlag) {
      payload.append('urlImage', '');
    }

    this.httpCategory.updateCategory(this.selectedId, payload).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Categoría Actualizada!',
          text: 'Se han guardado los cambios exitosamente.',
          timer: 1500,
          showConfirmButton: false
        });
        this.router.navigateByUrl('/category/list');
      },
      error: (err) => {
        console.error(err);
        const msg = err.error?.msg || 'Error al actualizar la categoría';
        Swal.fire('Error', msg, 'error');
      }
    });
  }

  get name() {
    return this.formData.get('name');
  }
}
