// ============================================
// ROLE GUARD - Enterprise Grade
// Protects routes requiring specific roles
// ============================================

import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';

import { AuthService } from '../../services/auth/auth.service';
import { UserRole } from '../../models';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Get required roles from route data
  const requiredRoles = route.data['roles'] as UserRole[];
  
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // Get user role
  const userRole = authService.getRole();
  
  if (!userRole) {
    router.navigate(['/login']);
    return false;
  }

  // Check if user has required role
  if (requiredRoles.includes(userRole as UserRole)) {
    return true;
  }

  // User doesn't have required role - redirect to appropriate dashboard
  switch (userRole) {
    case UserRole.ADMIN:
      router.navigate(['/admin/dashboard']);
      break;
    case UserRole.OFFICER:
      router.navigate(['/officer/dashboard']);
      break;
    case UserRole.CITIZEN:
      router.navigate(['/citizen/dashboard']);
      break;
    default:
      router.navigate(['/login']);
  }
  
  return false;
};

// Helper functions for common role checks
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const role = authService.getRole();
  
  if (role === UserRole.ADMIN) {
    return true;
  }
  
  router.navigate(['/unauthorized']);
  return false;
};

export const officerGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const role = authService.getRole();
  
  if (role === UserRole.OFFICER || role === UserRole.ADMIN) {
    return true;
  }
  
  router.navigate(['/unauthorized']);
  return false;
};

export const citizenGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const role = authService.getRole();
  
  if (role === UserRole.CITIZEN) {
    return true;
  }
  
  router.navigate(['/unauthorized']);
  return false;
};
