import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = (route, state) => {
  let authService = inject(Auth);
  let router = inject(Router);

  if (authService.estaLogueado()) {
    return router.parseUrl("/home");
  }
  else {
    return true;
  }

};