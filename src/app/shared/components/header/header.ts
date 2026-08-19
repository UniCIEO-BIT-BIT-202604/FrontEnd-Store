import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { AsyncPipe } from '@angular/common';
import { HttpAuth } from '../../../core/services/http-auth';
import { HttpCartStore } from '../../../core/services/http-cart-store';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  private router = inject(Router);
  public httpAuth = inject(HttpAuth);
  public httpCartStore = inject(HttpCartStore);

  getAvatarUrl(avatarPath: string | undefined | null): string {
    if (!avatarPath) return '';
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
      return avatarPath;
    }
    const cleanPath = avatarPath.startsWith('/') ? avatarPath.slice(1) : avatarPath;
    return `http://localhost:3000/${cleanPath}`;
  }

  // Método para cerrar la sesión del usuario (Asíncrono/Síncrono)
  logout(): void {
    this.httpAuth.logoutUser();
    this.router.navigateByUrl('/login');
  }

}
