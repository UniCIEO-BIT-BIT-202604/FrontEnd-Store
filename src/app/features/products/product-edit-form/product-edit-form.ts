import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpCategory } from '../../../core/services/http-category';
import { HttpProducts } from '../../../core/services/http-products';
import { Product, ProductImage } from '../../../core/models/Product';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';
import { ImagePreview } from '../product-new-form/product-new-form';

@Component({
  selector: 'app-product-edit-form',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, JsonPipe, RouterLink, NgIf, NgFor],
  templateUrl: './product-edit-form.html',
  styleUrl: './product-edit-form.css',
})
export default class ProductEditForm implements OnInit {
  selectedId!: string | null;
  serverHostUrl: string = environment.serverHostUrl;

  categoryList$ = new BehaviorSubject<any[]>([]);
  existingImages: ProductImage[] = [];
  selectedFiles: ImagePreview[] = [];

  deleteImageUrlsList: string[] = [];
  selectedMainUrl: string | null = null;
  deleteAllImagesFlag: boolean = false;

  imageError: string | null = null;

  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private httpCategory = inject(HttpCategory);
  private httpProducts = inject(HttpProducts);

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
    this.selectedId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getCategories();
    this.getProductData();
  }

  private getCategories(): void {
    this.httpCategory.getCategories().subscribe({
      next: (res) => this.categoryList$.next(res.data),
      error: (err) => console.error(err)
    });
  }

  private getProductData(): void {
    this.httpProducts.getProductById(this.selectedId).subscribe({
      next: (res) => {
        const product: Product = res.data;
        this.existingImages = product.images || [];

        const mainImg = this.existingImages.find(img => img.isMain);
        if (mainImg) {
          this.selectedMainUrl = mainImg.url;
        } else if (this.existingImages.length > 0) {
          this.selectedMainUrl = this.existingImages[0].url;
        }

        this.formData.patchValue({
          referenceCode: product.referenceCode,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          category: typeof product.category === 'object' ? product.category._id : product.category,
          status: product.status
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo obtener el producto', 'error');
      }
    });
  }

  getImageUrl(url: string): string {
    return `${this.serverHostUrl}${url.startsWith('/') ? url.slice(1) : url}`;
  }

  setMainImage(url: string): void {
    this.selectedMainUrl = url;
    this.existingImages = this.existingImages.map(img => ({
      ...img,
      isMain: img.url === url
    }));
    this.formData.markAsDirty();
  }

  removeExistingImage(url: string): void {
    this.existingImages = this.existingImages.filter(img => img.url !== url);
    if (!this.deleteImageUrlsList.includes(url)) {
      this.deleteImageUrlsList.push(url);
    }

    if (this.selectedMainUrl === url) {
      this.selectedMainUrl = this.existingImages.length > 0 ? this.existingImages[0].url : null;
      if (this.selectedMainUrl) {
        this.setMainImage(this.selectedMainUrl);
      }
    }
    this.formData.markAsDirty();
  }

  removeAllExistingImages(): void {
    const mainImage = this.existingImages.find(img => img.isMain);
    if (!mainImage && this.existingImages.length > 0) {
      this.existingImages[0].isMain = true;
    }
    const targetMain = mainImage || (this.existingImages.length > 0 ? this.existingImages[0] : null);

    if (!targetMain) {
      return;
    }

    Swal.fire({
      title: '¿Remover imágenes secundarias?',
      text: 'Se eliminarán todas las imágenes secundarias del producto conservando únicamente la imagen principal.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, conservar solo principal',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Recopilar URLs de todas las imágenes excepto la principal
        const urlsToDelete = this.existingImages
          .filter(img => img.url !== targetMain.url)
          .map(img => img.url);

        urlsToDelete.forEach(url => {
          if (!this.deleteImageUrlsList.includes(url)) {
            this.deleteImageUrlsList.push(url);
          }
        });

        // Dejar como única imagen existente la principal
        this.existingImages = [targetMain];
        this.selectedMainUrl = targetMain.url;
        this.formData.markAsDirty();
      }
    });
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.imageError = null;

    if (input.files && input.files.length > 0) {
      const filesArr = Array.from(input.files);
      const currentTotal = this.existingImages.length + this.selectedFiles.length + filesArr.length;

      if (currentTotal > 9) {
        this.imageError = 'No se pueden asociar más de nueve (9) imágenes a un producto.';
        return;
      }

      filesArr.forEach(file => {
        if (!file.type.startsWith('image/')) {
          this.imageError = 'Solo se permiten imágenes.';
          return;
        }
        if (file.size > 2 * 1024 * 1024) {
          this.imageError = `La imagen ${file.name} supera 2MB.`;
          return;
        }

        this.selectedFiles.push({
          file: file,
          previewUrl: URL.createObjectURL(file)
        });
      });
      this.formData.markAsDirty();
    }

    input.value = '';
  }

  removeNewSelectedFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.formData.markAsDirty();
  }

  onSubmit(): void {
    const totalRemaining = this.existingImages.length + this.selectedFiles.length;
    if (totalRemaining === 0) {
      this.imageError = 'El producto debe conservar o incluir al menos una (1) imagen.';
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

    if (this.deleteAllImagesFlag) {
      payload.append('deleteAllImages', 'true');
    } else if (this.deleteImageUrlsList.length > 0) {
      this.deleteImageUrlsList.forEach(url => {
        payload.append('deleteImageUrls', url);
      });
    }

    if (this.selectedMainUrl) {
      payload.append('mainImageUrl', this.selectedMainUrl);
    }

    this.selectedFiles.forEach(item => {
      payload.append('images', item.file);
    });

    this.httpProducts.updateProduct(this.selectedId, payload).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: '¡Producto Actualizado!',
          text: 'Se han guardado los cambios e imágenes del producto.',
          timer: 2000,
          showConfirmButton: false
        });
        this.router.navigateByUrl('/product/list');
      },
      error: (err) => {
        console.error(err);
        const backendMsg = err.error?.msg || 'Ocurrió un error al actualizar el producto.';
        const backendErrors = err.error?.errors;
        let detailText = backendMsg;

        if (backendErrors && typeof backendErrors === 'object') {
          detailText = Object.values(backendErrors).join('\n');
        }

        Swal.fire({
          icon: 'error',
          title: 'Error de Actualización',
          text: detailText
        });
      }
    });
  }

  get referenceCode() { return this.formData.get('referenceCode'); }
  get name() { return this.formData.get('name'); }
  get price() { return this.formData.get('price'); }
  get stock() { return this.formData.get('stock'); }
  get category() { return this.formData.get('category'); }
}
