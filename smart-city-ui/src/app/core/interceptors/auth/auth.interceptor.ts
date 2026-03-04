// ============================================
// AUTH INTERCEPTOR - Enterprise Grade
// Adds JWT token to all HTTP requests
// ============================================

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../../services/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // Get token
  const token = authService.getToken();
  
  // Clone request and add authorization header if token exists
  let authReq = req;
  
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  // Pass to next handler and handle errors
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized
      if (error.status === 401) {
        // Token might be expired, try to refresh or logout
        authService.logout();
      }
      
      // Handle other errors
      let errorMessage = 'An error occurred';
      
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = error.error.message;
      } else {
        // Server-side error
        errorMessage = error.error?.message || `Error Code: ${error.status}`;
      }
      
      console.error('HTTP Error:', errorMessage);
      return throwError(() => new Error(errorMessage));
    })
  );
};

// ============================================
// ERROR INTERCEPTOR - Handles API errors globally
// ============================================

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';
      
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Bad request';
          break;
        case 403:
          errorMessage = 'You do not have permission to perform this action';
          break;
        case 404:
          errorMessage = error.error?.message || 'Resource not found';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
        case 0:
          errorMessage = 'Unable to connect to server. Please check your connection.';
          break;
      }
      
      console.error('API Error:', errorMessage, error);
      return throwError(() => new Error(errorMessage));
    })
  );
};

// ============================================
// LOADING INTERCEPTOR - Shows/hides loading indicator
// ============================================

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // You can implement global loading state management here
  // For example, using a shared LoadingService
  
  return next(req);
};
