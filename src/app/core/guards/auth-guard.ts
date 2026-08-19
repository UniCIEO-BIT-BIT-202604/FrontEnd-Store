import { CanActivateFn } from '@angular/router';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  return of(false);
};
