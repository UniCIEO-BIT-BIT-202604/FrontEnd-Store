import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpCategory } from '../../../core/services/http-category';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { HttpProducts } from '../../../core/services/http-products';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

export interface ImagePreview {
  file: File;
  previewUrl: string;
}

@Component({
  selector: 'app-product-new-form',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, JsonPipe, RouterLink, NgIf, NgFor],
  templateUrl: './product-new-form.html',
  styleUrl: './product-new-form.css',
})
export default class ProductNewForm implements OnInit {
  categoryList$ = new BehaviorSubject<any[]>([]);
  selectedFiles: ImagePreview[] = [];
  imageError: string | null = null;

  private httpCategory = inject(HttpCategory);
  private httpProducts = inject(HttpProducts);
  private router = inject(Router);

  formData: FormGroup;

  constructor() {
    this.formData = new FormGroup({
      referenceCode: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl(''),
      price: new FormControl(0, [Validators.required, Validators.min(0)]),
      stock: new FormControl(1, [Validators.required, Validators.min(1)]),
      category: new FormControl('', [Validators.required]),
      status: new FormControl(true)
    });
  }

  ngOnInit(): void {
    this.httpCategory.getCategories().subscribe({
      next: (res) => {
        const categories = res.data || [];
        this.categoryList$.next(categories);

        // Preseleccionar "Sin Categoría" por defecto usando su slug o nombre
        const defaultCat = categories.find((c: any) => c.slug === 'sin-categoria' || c.name === 'Sin Categoría');

        if (defaultCat) {
          this.formData.patchValue({ category: defaultCat._id });
        }
        else if (categories.length > 0) {
          this.formData.patchValue({ category: categories[0]._id });
        }
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
      }
    });
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.imageError = null;

    if (input.files && input.files.length > 0) {
      const filesArr = Array.from(input.files);

      if (this.selectedFiles.length + filesArr.length > 9) {
        this.imageError = 'No puedes seleccionar más de nueve (9) imágenes en total.';
        return;
      }

      filesArr.forEach(file => {
        if (!file.type.startsWith('image/')) {
          this.imageError = 'Solo se admiten archivos de imagen.';
          return;
        }
        if (file.size > 2 * 1024 * 1024) {
          this.imageError = `La imagen ${file.name} supera el límite de 2MB.`;
          return;
        }

        // Agregar el archivo de forma sincrónica e inmediata al arreglo selectedFiles
        this.selectedFiles.push({
          file: file,
          previewUrl: URL.createObjectURL(file)
        });
      });
    }

    input.value = '';
  }

  removeSelectedFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    if (this.selectedFiles.length === 0) {
      this.imageError = 'El producto debe incluir al menos una (1) imagen.';
    } else {
      this.imageError = null;
    }
  }

  onSubmit(): void {
    if (this.selectedFiles.length === 0) {
      this.imageError = 'El producto debe incluir al menos una (1) imagen obligatoria.';
      this.formData.markAllAsTouched();
      return;
    }

    if (this.formData.invalid) {
      this.formData.markAllAsTouched();
      return;
    }

    const payload = new FormData();
    Object.keys(this.formData.controls).forEach(key => {
      payload.append(key, this.formData.get(key)?.value);
    });

    this.selectedFiles.forEach(item => {
      payload.append('images', item.file);
    });

    this.httpProducts.createProduct(payload).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: '¡Producto Creado!',
          text: 'El producto se ha registrado correctamente con sus imágenes.',
          timer: 2000,
          showConfirmButton: false
        });
        this.router.navigateByUrl('/product/list');
      },
      error: (err) => {
        console.error(err);
        const backendMsg = err.error?.msg || 'Ocurrió un error al registrar el producto.';
        const backendErrors = err.error?.errors;
        let detailText = backendMsg;

        if (backendErrors && typeof backendErrors === 'object') {
          detailText = Object.values(backendErrors).join('\n');
        }

        Swal.fire({
          icon: 'error',
          title: 'Error de Validación',
          text: detailText
        });
      }
    });
  }

  get referenceCode() {
    return this.formData.get('referenceCode');
  }

  get name() {
    return this.formData.get('name');
  }

  get price() {
    return this.formData.get('price');
  }

  get stock() {
    return this.formData.get('stock');
  }

  get category() {
    return this.formData.get('category');
  }
}
