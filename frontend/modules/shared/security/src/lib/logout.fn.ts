import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { map } from 'rxjs';

export const logoutFn: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.logout().pipe(map(() => router.createUrlTree(['/'])));
};
