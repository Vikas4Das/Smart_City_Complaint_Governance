// ============================================
// ADMIN DASHBOARD COMPONENT
// ============================================

import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { ComplaintService } from '../../../core/services/complaint/complaint.service';
import { DashboardStats } from '../../../core/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back! Here's what's happening with city complaints.</p>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <mat-card class="stat-card">
          <div class="stat-icon blue">
            <mat-icon>assignment</mat-icon>
          </div>
          <div class="stat-content">
            <span class="stat-label">Total Complaints</span>
            <span class="stat-value">{{ stats()?.totalComplaints || 0 }}</span>
          </div>
        </mat-card>

        <mat-card class="stat-card">
          <div class="stat-icon yellow">
            <mat-icon>pending</mat-icon>
          </div>
          <div class="stat-content">
            <span class="stat-label">Pending</span>
            <span class="stat-value">{{ stats()?.pendingComplaints || 0 }}</span>
          </div>
        </mat-card>

        <mat-card class="stat-card">
          <div class="stat-icon blue">
            <mat-icon>engineering</mat-icon>
          </div>
          <div class="stat-content">
            <span class="stat-label">In Progress</span>
            <span class="stat-value">{{ stats()?.inProgressComplaints || 0 }}</span>
          </div>
        </mat-card>

        <mat-card class="stat-card">
          <div class="stat-icon green">
            <mat-icon>check_circle</mat-icon>
          </div>
          <div class="stat-content">
            <span class="stat-label">Resolved</span>
            <span class="stat-value">{{ stats()?.resolvedComplaints || 0 }}</span>
          </div>
        </mat-card>
      </div>

      <!-- Recent Activity -->
      <mat-card class="activity-card">
        <h2>Recent Complaints</h2>
        <div class="activity-list">
          <div class="activity-item" *ngFor="let i of [1,2,3,4,5]">
            <div class="activity-icon">
              <mat-icon>assignment_late</mat-icon>
            </div>
            <div class="activity-content">
              <span class="activity-title">Pothole on Main Street #{{i}}</span>
              <span class="activity-meta">Citizen • 2 hours ago</span>
            </div>
            <div class="activity-status pending">Pending</div>
          </div>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 0;
    }

    .dashboard-header {
      margin-bottom: 32px;
    }

    .dashboard-header h1 {
      margin: 0 0 8px;
      font-size: 28px;
      font-weight: 700;
      color: #1e293b;
    }

    .dashboard-header p {
      margin: 0;
      color: #64748b;
      font-size: 14px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .stat-card {
      padding: 24px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon.blue { background: #dbeafe; color: #2563eb; }
    .stat-icon.yellow { background: #fef3c7; color: #d97706; }
    .stat-icon.green { background: #dcfce7; color: #16a34a; }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-label {
      font-size: 13px;
      color: #64748b;
      font-weight: 500;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: #1e293b;
    }

    .activity-card {
      padding: 24px;
      border-radius: 16px;
    }

    .activity-card h2 {
      margin: 0 0 24px;
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: #f8fafc;
      border-radius: 12px;
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: #fef3c7;
      color: #d97706;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .activity-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .activity-title {
      font-size: 14px;
      font-weight: 500;
      color: #334155;
    }

    .activity-meta {
      font-size: 12px;
      color: #94a3b8;
    }

    .activity-status {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .activity-status.pending {
      background: #fef3c7;
      color: #d97706;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private readonly complaintService = inject(ComplaintService);

  protected readonly stats = signal<DashboardStats | null>(null);

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    this.complaintService.getDashboardStats().subscribe({
      next: (stats) => this.stats.set(stats)
    });
  }
}
