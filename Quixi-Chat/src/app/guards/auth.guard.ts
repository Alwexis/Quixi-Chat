import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.isLoggedIn().then((isLoggedIn) => {
    if (isLoggedIn) {
      return true;
    } else {
      return router.createUrlTree(['/login']);
    }
  });
};
