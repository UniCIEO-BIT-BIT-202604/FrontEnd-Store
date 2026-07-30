import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AsyncPipe } from '@angular/common';
import { HttpAuth } from '../../../core/services/http-auth';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  // Inyección pública del servicio de autenticación para uso directo en la plantilla HTML
  public httpAuth = inject(HttpAuth);

  // Método para cerrar la sesión del usuario
  logout(): void {
    this.httpAuth.logoutUser();
  }

}
