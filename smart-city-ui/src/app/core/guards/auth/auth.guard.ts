// ============================================
// AUTH GUARD - Enterprise Grade
// Protects routes requiring authentication
// ============================================

import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';

import { AuthService } from '../../services/auth/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: route.url.join('/') }
    });
    return false;
  }

  // Check if token is expired
  if (authService.isTokenExpired()) {
    authService.logout();
    router.navigate(['/login']);
    return false;
  }

  return true;
};

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Redirect authenticated users away from login/register pages
  if (authService.isAuthenticated() && !authService.isTokenExpired()) {
    const role = authService.getRole();
    
    switch (role) {
      case 'ROLE_ADMIN':
        router.navigate(['/admin/dashboard']);
        break;
      case 'ROLE_OFFICER':
        router.navigate(['/officer/dashboard']);
        break;
      case 'ROLE_CITIZEN':
        router.navigate(['/citizen/dashboard']);
        break;
      default:
        router.navigate(['/login']);
    }
    return false;
  }

  return true;
};
