import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpCategory } from '../../../core/services/http-category';
import { Category } from '../../../core/models/Category';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { ToggleOffIcon, ToggleOnIcon } from '@hugeicons/core-free-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [RouterLink, AsyncPipe, JsonPipe, NgIf, NgFor, HugeiconsIconComponent, FontAwesomeModule],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export default class CategoryList implements OnInit {
  categoryList$ = new BehaviorSubject<Category[]>([]);

  serverHostUrl: string = environment.serverHostUrl;
  defaultCategoryImageUrl: string = environment.defaultCategoryImageUrl;
  defaultUIAvatarAPI: string = environment.defaultUIAvatarAPI;

  faFolder = faFolder;

  ToggleOffIcon = ToggleOffIcon;
  ToggleOnIcon = ToggleOnIcon;

  private httpCategory = inject(HttpCategory);

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.httpCategory.getCategories().subscribe({
      next: (res) => {
        this.categoryList$.next(res.data || []);
      },
      error: (err) => {
        console.error('Error al obtener categorías:', err);
      }
    });
  }

  getImageUrl(urlImage: string | undefined): string {
    if (!urlImage) {
      return `${this.serverHostUrl}uploads/categories/default-category.png`;
    }
    return `${this.serverHostUrl}${urlImage.startsWith('/') ? urlImage.slice(1) : urlImage}`;
  }

  getCustomImageUrl(urlImage: string | undefined): string {
    if (!urlImage) return '';
    return `${this.serverHostUrl}${urlImage.startsWith('/') ? urlImage.slice(1) : urlImage}`;
  }

  toggleStatus(category: Category): void {
    if (!category._id) return;
    const newStatus = !category.status;
    this.httpCategory.updateCategory(category._id, { status: newStatus }).subscribe({
      next: () => {
        category.status = newStatus;
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000
        });
        Toast.fire({
          icon: 'success',
          title: `Categoría ${newStatus ? 'Activada' : 'Desactivada'}`
        });
      },
      error: (err) => {
        console.error('Error al actualizar estado:', err);
        Swal.fire('Error', 'No se pudo cambiar el estado de la categoría', 'error');
      }
    });
  }

  deleteCategory(id: string | undefined): void {
    if (!id) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se eliminará la categoría de la base de datos.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpCategory.deleteCategory(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminada',
              text: 'La categoría ha sido eliminada correctamente.',
              timer: 1500,
              showConfirmButton: false
            });
            this.loadCategories();
          },
          error: (err) => {
            console.error('Error al eliminar categoría:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar la categoría.'
            });
          }
        });
      }
    });
  }
}
