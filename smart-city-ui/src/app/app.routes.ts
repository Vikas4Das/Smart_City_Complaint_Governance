// ============================================
// APP ROUTES - Enterprise Grade Routing
// ============================================

import { Routes } from '@angular/router';

import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';

export const routes: Routes = [
  // ----------------------------------------
  // GUEST ROUTES
  // ----------------------------------------
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },

  // ----------------------------------------
  // AUTHENTICATED ROUTES
  // ----------------------------------------
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      // Admin Routes
      {
        path: 'admin',
        children: [
          {
            path: 'dashboard',
            loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
          },
          {
            path: 'complaints',
            loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
          },
          {
            path: 'officers',
            loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
          },
          {
            path: 'analytics',
            loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
          }
        ]
      },

      // Officer Routes
      {
        path: 'officer',
        children: [
          {
            path: 'dashboard',
            loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
          },
          {
            path: 'tasks',
            loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
          }
        ]
      },

      // Citizen Routes
      {
        path: 'citizen',
        children: [
          {
            path: 'dashboard',
            loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
          },
          {
            path: 'complaints',
            loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
          },
          {
            path: 'complaint',
            children: [
              {
                path: 'new',
                loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
              }
            ]
          }
        ]
      }
    ]
  },

  // ----------------------------------------
  // WILDCARD
  // ----------------------------------------
  {
    path: '**',
    redirectTo: 'login'
  }
];
