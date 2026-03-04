// ============================================
// MAIN LAYOUT COMPONENT - Shell Component
// Wraps authenticated pages with sidebar and navbar
// ============================================

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    NavbarComponent
  ],
  template: `
    <div class="layout-wrapper" [class.sidebar-collapsed]="sidebarCollapsed()">
      <!-- Sidebar -->
      <app-sidebar></app-sidebar>

      <!-- Main Content Area -->
      <div class="main-container">
        <!-- Navbar -->
        <app-navbar (toggleSidebar)="toggleSidebar()"></app-navbar>

        <!-- Page Content -->
        <main class="page-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    /* ============================================
       MAIN LAYOUT STYLES
       ============================================ */

    .layout-wrapper {
      display: flex;
      min-height: 100vh;
      background: #f8fafc;
    }

    .main-container {
      flex: 1;
      margin-left: 260px;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .layout-wrapper.sidebar-collapsed .main-container {
      margin-left: 72px;
    }

    .page-content {
      flex: 1;
      padding: 24px;
      overflow-x: hidden;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .main-container {
        margin-left: 72px;
      }
    }

    @media (max-width: 768px) {
      .main-container {
        margin-left: 0;
      }

      .page-content {
        padding: 16px;
      }
    }
  `]
})
export class MainLayoutComponent {
  // Signals
  protected readonly sidebarCollapsed = signal(false);

  // Methods
  protected toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }
}
