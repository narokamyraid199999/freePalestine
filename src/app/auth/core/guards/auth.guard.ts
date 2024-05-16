import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  let router = inject(Router);

  let token: string | null = localStorage.getItem('token');
  let doctorToken: string | null = localStorage.getItem('doctorToken');
  let adminToken = localStorage.getItem('adminToken');

  if (
    route.url[0].path.includes('login') ||
    route.url[0].path.includes('signup')
  ) {
    if (adminToken && adminToken?.length > 0) {
      router.navigate(['/admin/dashboard']);
      return false;
    }

    if (token || token != null || doctorToken || doctorToken != null) {
      router.navigate(['/main']);
      return false;
    } else {
      return true;
    }
  }

  if (token && token.length > 0) {
    return true;
  } else {
    router.navigate(['/auth/login']);
    return false;
  }

  return true;
};
