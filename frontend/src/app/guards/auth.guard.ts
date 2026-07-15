import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/AuthService';

/** Blocks navigation unless a session is active, restoring it from the session cookie first if needed. */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.currentUser()) {
    return true;
  }

  return authService.getCurrentUser().pipe(
    map(() => true),
    catchError(() => of(router.parseUrl('/login'))),
  );
};
