// ============================================
// NAVBAR COMPONENT - Smart City Portal
// Professional admin dashboard navbar
// ============================================

import { Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
MatBadgeModule,
    MatTooltipModule,
    MatDividerModule
  ],
  template: `
    <header class="navbar">
      <!-- Left Section -->
      <div class="navbar-left">
        <button 
          class="menu-toggle" 
          (click)="toggleSidebar.emit()"
          matTooltip="Toggle sidebar"
          matRipple>
          <mat-icon>menu</mat-icon>
        </button>
        
        <div class="breadcrumb">
          <span class="page-title">{{ pageTitle() }}</span>
        </div>
      </div>

      <!-- Right Section -->
      <div class="navbar-right">
        <!-- Search -->
        <button 
          class="nav-icon-btn" 
          matTooltip="Search"
          matRipple>
          <mat-icon>search</mat-icon>
        </button>

        <!-- Notifications -->
        <button 
          class="nav-icon-btn" 
          [matBadge]="notificationCount()" 
          [matBadgeHidden]="notificationCount() === 0"
          matBadgeColor="warn"
          matBadgeSize="small"
          matTooltip="Notifications"
          [matMenuTriggerFor]="notificationMenu"
          matRipple>
          <mat-icon>notifications</mat-icon>
        </button>

        <mat-menu #notificationMenu="matMenu" class="notification-menu">
          <div class="menu-header">
            <span>Notifications</span>
            <button mat-button color="primary">Mark all read</button>
          </div>
          <div class="notification-list">
            <div class="notification-item unread">
              <mat-icon class="notif-icon success">check_circle</mat-icon>
              <div class="notif-content">
                <p>Complaint #1234 has been resolved</p>
                <span class="notif-time">2 minutes ago</span>
              </div>
            </div>
            <div class="notification-item unread">
              <mat-icon class="notif-icon warning">warning</mat-icon>
              <div class="notif-content">
                <p>New complaint requires attention</p>
                <span class="notif-time">15 minutes ago</span>
              </div>
            </div>
            <div class="notification-item">
              <mat-icon class="notif-icon info">info</mat-icon>
              <div class="notif-content">
                <p>System maintenance scheduled</p>
                <span class="notif-time">1 hour ago</span>
              </div>
            </div>
          </div>
          <button mat-menu-item class="view-all">View all notifications</button>
        </mat-menu>

        <!-- Quick Actions -->
        <button 
          class="nav-icon-btn" 
          matTooltip="Quick actions"
          [matMenuTriggerFor]="quickActionsMenu"
          matRipple>
          <mat-icon>add_circle</mat-icon>
        </button>

        <mat-menu #quickActionsMenu="matMenu">
          <button mat-menu-item routerLink="/citizen/complaint/new">
            <mat-icon>add_circle</mat-icon>
            <span>New Complaint</span>
          </button>
          <button mat-menu-item>
            <mat-icon>person_add</mat-icon>
            <span>Add User</span>
          </button>
          <button mat-menu-item>
            <mat-icon>file_download</mat-icon>
            <span>Export Report</span>
          </button>
        </mat-menu>

        <!-- User Menu -->
        <div class="user-menu" [matMenuTriggerFor]="userMenu">
          <div class="user-avatar">
            <mat-icon>account_circle</mat-icon>
          </div>
          <div class="user-info">
            <span class="user-name">{{ userName() }}</span>
            <span class="user-role">{{ userRole() }}</span>
          </div>
          <mat-icon class="dropdown-icon">expand_more</mat-icon>
        </div>

        <mat-menu #userMenu="matMenu" class="user-dropdown-menu">
          <div class="user-menu-header">
            <div class="user-avatar-lg">
              <mat-icon>account_circle</mat-icon>
            </div>
            <div class="user-details">
              <span class="name">{{ userName() }}</span>
              <span class="email">{{ userEmail() }}</span>
            </div>
          </div>
          <mat-divider></mat-divider>
          <button mat-menu-item routerLink="/profile">
            <mat-icon>person</mat-icon>
            <span>My Profile</span>
          </button>
          <button mat-menu-item routerLink="/settings">
            <mat-icon>settings</mat-icon>
            <span>Settings</span>
          </button>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout()" class="logout-btn">
            <mat-icon>logout</mat-icon>
            <span>Logout</span>
          </button>
        </mat-menu>
      </div>
    </header>
  `,
  styles: [`
    /* ============================================
       NAVBAR STYLES - Professional SaaS Look
       ============================================ */

    .navbar {
      height: 72px;
      background: white;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      border-bottom: 1px solid #e2e8f0;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    /* Left Section */
    .navbar-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .menu-toggle {
      width: 40px;
      height: 40px;
      border: none;
      background: transparent;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #475569;
      transition: all 0.2s;
    }

    .menu-toggle:hover {
      background: #f1f5f9;
      color: #1e293b;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
    }

    .page-title {
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
    }

    /* Right Section */
    .navbar-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .nav-icon-btn {
      width: 40px;
      height: 40px;
      border: none;
      background: transparent;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #64748b;
      transition: all 0.2s;
      position: relative;
    }

    .nav-icon-btn:hover {
      background: #f1f5f9;
      color: #1e293b;
    }

    /* User Menu */
    .user-menu {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 6px 12px 6px 6px;
      margin-left: 8px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .user-menu:hover {
      background: #f8fafc;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-avatar mat-icon {
      color: white;
      font-size: 24px;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
    }

    .user-role {
      font-size: 12px;
      color: #64748b;
      text-transform: capitalize;
    }

    .dropdown-icon {
      color: #94a3b8;
      font-size: 20px;
    }

    /* Notification Menu Styles */
    ::ng-deep .notification-menu {
      width: 360px;
      max-width: 90vw;
    }

    .menu-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #e2e8f0;
    }

    .menu-header span {
      font-weight: 600;
      color: #1e293b;
    }

    .notification-list {
      max-height: 320px;
      overflow-y: auto;
    }

    .notification-item {
      display: flex;
      gap: 12px;
      padding: 12px 16px;
      cursor: pointer;
      transition: background 0.2s;
    }

    .notification-item:hover {
      background: #f8fafc;
    }

    .notification-item.unread {
      background: #f0f9ff;
    }

    .notif-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .notif-icon.success {
      background: #dcfce7;
      color: #16a34a;
    }

    .notif-icon.warning {
      background: #fef3c7;
      color: #d97706;
    }

    .notif-icon.info {
      background: #dbeafe;
      color: #2563eb;
    }

    .notif-content p {
      margin: 0;
      font-size: 14px;
      color: #334155;
    }

    .notif-time {
      font-size: 12px;
      color: #94a3b8;
    }

    .view-all {
      text-align: center;
      color: #3b82f6;
      font-weight: 500;
    }

    /* User Dropdown Menu */
    ::ng-deep .user-dropdown-menu {
      width: 280px;
    }

    .user-menu-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
    }

    .user-avatar-lg {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-avatar-lg mat-icon {
      color: white;
      font-size: 28px;
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .user-details .name {
      font-weight: 600;
      color: #1e293b;
    }

    .user-details .email {
      font-size: 13px;
      color: #64748b;
    }

    .logout-btn {
      color: #ef4444 !important;
    }

    .logout-btn mat-icon {
      color: #ef4444;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .user-info {
        display: none;
      }
      
      .navbar {
        padding: 0 16px;
      }
    }
  `]
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);

  // Outputs
  protected readonly toggleSidebar = output<void>();

  // Signals
  protected readonly notificationCount = signal(3);

  // Computed
  protected readonly pageTitle = signal('Dashboard');

  protected readonly userName = () => {
    const user = this.authService.user();
    return user ? `${user.firstName} ${user.lastName}` : 'User';
  };

  protected readonly userEmail = () => {
    const user = this.authService.user();
    return user?.email || 'user@smartcity.gov';
  };

  protected readonly userRole = () => {
    const role = this.authService.userRole();
    return role ? role.replace('ROLE_', '').toLowerCase() : 'guest';
  };

  // Methods
  protected logout(): void {
    this.authService.logout();
  }
}
