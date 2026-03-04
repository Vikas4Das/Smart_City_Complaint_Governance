// ============================================
// SIDEBAR COMPONENT - Smart City Portal
// Professional admin dashboard sidebar
// ============================================

import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';

import { AuthService } from '../../../core/services/auth/auth.service';
import { UserRole } from '../../../core/models';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles: UserRole[];
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatIconModule, 
    MatTooltipModule,
    MatRippleModule
  ],
  template: `
    <aside class="sidebar" [class.collapsed]="isCollapsed()">
      <!-- Logo Section -->
      <div class="sidebar-header">
        <div class="logo">
          <mat-icon class="logo-icon">location_city</mat-icon>
          <span class="logo-text" *ngIf="!isCollapsed()">SmartCity</span>
        </div>
        <button class="collapse-btn" (click)="toggleCollapse()" matRipple>
          <mat-icon>{{ isCollapsed() ? 'chevron_right' : 'chevron_left' }}</mat-icon>
        </button>
      </div>

      <!-- Navigation Menu -->
      <nav class="sidebar-nav">
        <ul class="nav-list">
          @for (item of visibleMenuItems(); track item.route) {
            <li class="nav-item">
              <a 
                [routerLink]="item.route" 
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: item.route === '/admin' || item.route === '/officer' || item.route === '/citizen' }"
                class="nav-link"
                [matTooltip]="isCollapsed() ? item.label : ''"
                matTooltipPosition="right"
                matRipple>
                <mat-icon>{{ item.icon }}</mat-icon>
                <span class="nav-label" *ngIf="!isCollapsed()">{{ item.label }}</span>
                <mat-icon class="arrow" *ngIf="item.children && !isCollapsed()">expand_more</mat-icon>
              </a>
              
              <!-- Submenu -->
              @if (item.children && !isCollapsed()) {
                <ul class="submenu">
                  @for (child of item.children; track child.route) {
                    <li class="submenu-item">
                      <a 
                        [routerLink]="child.route" 
                        routerLinkActive="active"
                        class="submenu-link"
                        matRipple>
                        <mat-icon>{{ child.icon }}</mat-icon>
                        <span>{{ child.label }}</span>
                      </a>
                    </li>
                  }
                </ul>
              }
            </li>
          }
        </ul>
      </nav>

      <!-- User Section -->
      <div class="sidebar-footer">
        <div class="user-info" [class.collapsed]="isCollapsed()">
          <div class="user-avatar">
            <mat-icon>account_circle</mat-icon>
          </div>
          <div class="user-details" *ngIf="!isCollapsed()">
            <span class="user-name">{{ userName() }}</span>
            <span class="user-role">{{ userRole() }}</span>
          </div>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    /* ============================================
       SIDEBAR STYLES - Professional SaaS Look
       ============================================ */
    
    .sidebar {
      width: 260px;
      height: 100vh;
      background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
      display: flex;
      flex-direction: column;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1000;
      box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
    }

    .sidebar.collapsed {
      width: 72px;
    }

    /* Header */
    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      color: #3b82f6;
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .logo-text {
      font-size: 20px;
      font-weight: 700;
      color: white;
      letter-spacing: -0.5px;
    }

    .collapse-btn {
      background: rgba(255, 255, 255, 0.08);
      border: none;
      border-radius: 8px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .collapse-btn:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    .collapse-btn mat-icon {
      color: rgba(255, 255, 255, 0.7);
      font-size: 20px;
    }

    /* Navigation */
    .sidebar-nav {
      flex: 1;
      padding: 16px 12px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .nav-item {
      margin-bottom: 4px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      border-radius: 10px;
      transition: all 0.2s;
      position: relative;
    }

    .nav-link:hover {
      background: rgba(255, 255, 255, 0.08);
      color: white;
    }

    .nav-link.active {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .nav-link mat-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
    }

    .nav-label {
      font-size: 14px;
      font-weight: 500;
    }

    .arrow {
      margin-left: auto;
      font-size: 18px;
    }

    /* Submenu */
    .submenu {
      list-style: none;
      padding: 0;
      margin: 4px 0 0 36px;
    }

    .submenu-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 16px;
      color: rgba(255, 255, 255, 0.6);
      text-decoration: none;
      border-radius: 8px;
      font-size: 13px;
      transition: all 0.2s;
    }

    .submenu-link:hover,
    .submenu-link.active {
      background: rgba(255, 255, 255, 0.08);
      color: white;
    }

    .submenu-link mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    /* Footer */
    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
    }

    .user-info.collapsed {
      justify-content: center;
      padding: 12px 8px;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .user-avatar mat-icon {
      color: white;
      font-size: 24px;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .user-name {
      color: white;
      font-size: 14px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role {
      color: rgba(255, 255, 255, 0.6);
      font-size: 12px;
      text-transform: capitalize;
    }

    /* Scrollbar */
    .sidebar-nav::-webkit-scrollbar {
      width: 6px;
    }

    .sidebar-nav::-webkit-scrollbar-track {
      background: transparent;
    }

    .sidebar-nav::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
    }

    .sidebar-nav::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  `]
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);

  // Signals
  protected readonly isCollapsed = signal(false);

  // Menu Items
  private readonly menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/admin/dashboard',
      roles: [UserRole.ADMIN]
    },
    {
      label: 'Complaints',
      icon: 'complaint',
      route: '/admin/complaints',
      roles: [UserRole.ADMIN],
      children: [
        { label: 'All Complaints', icon: 'list', route: '/admin/complaints', roles: [UserRole.ADMIN] },
        { label: 'Pending', icon: 'pending', route: '/admin/complaints/pending', roles: [UserRole.ADMIN] },
        { label: 'Resolved', icon: 'check_circle', route: '/admin/complaints/resolved', roles: [UserRole.ADMIN] }
      ]
    },
    {
      label: 'Officers',
      icon: 'people',
      route: '/admin/officers',
      roles: [UserRole.ADMIN]
    },
    {
      label: 'Analytics',
      icon: 'analytics',
      route: '/admin/analytics',
      roles: [UserRole.ADMIN]
    },
    {
      label: 'My Dashboard',
      icon: 'dashboard',
      route: '/officer/dashboard',
      roles: [UserRole.OFFICER]
    },
    {
      label: 'Assigned Tasks',
      icon: 'assignment',
      route: '/officer/tasks',
      roles: [UserRole.OFFICER]
    },
    {
      label: 'Citizen Dashboard',
      icon: 'dashboard',
      route: '/citizen/dashboard',
      roles: [UserRole.CITIZEN]
    },
    {
      label: 'File Complaint',
      icon: 'add_circle',
      route: '/citizen/complaint/new',
      roles: [UserRole.CITIZEN]
    },
    {
      label: 'My Complaints',
      icon: 'list_alt',
      route: '/citizen/complaints',
      roles: [UserRole.CITIZEN]
    }
  ];

  // Computed
  protected readonly userName = computed(() => {
    const user = this.authService.user();
    return user ? `${user.firstName} ${user.lastName}` : 'User';
  });

  protected readonly userRole = computed(() => {
    const role = this.authService.userRole();
    return role ? role.replace('ROLE_', '').toLowerCase() : 'guest';
  });

  protected readonly visibleMenuItems = computed(() => {
    const userRole = this.authService.userRole();
    return this.menuItems.filter(item => 
      userRole && item.roles.includes(userRole)
    );
  });

  // Methods
  protected toggleCollapse(): void {
    this.isCollapsed.update(v => !v);
  }
}
