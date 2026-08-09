import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpCategory } from '../../../core/services/http-category';
import { Category } from '../../../core/models/Category';
import { NgIf } from '@angular/common';
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

  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private httpCategory = inject(HttpCategory);

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

  ngOnInit(): void {
    this.selectedId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getCategoryData();
  }

  private getCategoryData(): void {
    this.httpCategory.getCategoryById(this.selectedId).subscribe({
      next: (res) => {
        const cat: Category = res.data;
        this.formData.patchValue({
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          urlImage: cat.urlImage,
          status: cat.status
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo obtener la categoría', 'error');
      }
    });
  }

  onSubmit(): void {
    if (this.formData.invalid) {
      this.formData.markAllAsTouched();
      return;
    }

    this.httpCategory.updateCategory(this.selectedId, this.formData.value).subscribe({
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
