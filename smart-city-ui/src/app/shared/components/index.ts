// ============================================
// SHARED UI COMPONENTS - Dumb Components
// Reusable, presentational components
// ============================================

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// ============================================
// STAT CARD COMPONENT - Displays metrics
// ============================================

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card class="stat-card" [class.clickable]="clickable">
      <div class="stat-icon" [style.backgroundColor]="iconBgColor">
        <mat-icon>{{ icon }}</mat-icon>
      </div>
      <div class="stat-content">
        <span class="stat-label">{{ label }}</span>
        <span class="stat-value">{{ value }}</span>
        <span class="stat-trend" *ngIf="trend" [class.positive]="trend > 0" [class.negative]="trend < 0">
          <mat-icon>{{ trend > 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
          {{ Math.abs(trend) }}%
        </span>
      </div>
    </mat-card>
  `,
  styles: [`
    .stat-card {
      display: flex;
      align-items: center;
      padding: 20px;
      border-radius: 12px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .stat-card.clickable {
      cursor: pointer;
    }
    .stat-card.clickable:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }
    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
    }
    .stat-icon mat-icon {
      color: white;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    .stat-content {
      display: flex;
      flex-direction: column;
    }
    .stat-label {
      font-size: 13px;
      color: #64748b;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: #1e293b;
      margin: 4px 0;
    }
    .stat-trend {
      display: flex;
      align-items: center;
      font-size: 13px;
      font-weight: 600;
    }
    .stat-trend mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      margin-right: 2px;
    }
    .stat-trend.positive {
      color: #10b981;
    }
    .stat-trend.negative {
      color: #ef4444;
    }
  `]
})
export class StatCardComponent {
  @Input() label = '';
  @Input() value: string | number = 0;
  @Input() icon = 'analytics';
  @Input() iconBgColor = '#3b82f6';
  @Input() trend?: number;
  @Input() clickable = false;
  @Output() cardClick = new EventEmitter<void>();

  protected Math = Math;

  onClick(): void {
    if (this.clickable) {
      this.cardClick.emit();
    }
  }
}

// ============================================
// LOADING SPINNER COMPONENT
// ============================================

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="loading-container" *ngIf="show">
      <mat-spinner [diameter]="diameter"></mat-spinner>
      <p *ngIf="message" class="loading-message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
    }
    .loading-message {
      margin-top: 16px;
      color: #64748b;
      font-size: 14px;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() show = false;
  @Input() message?: string;
  @Input() diameter = 40;
}

// ============================================
// EMPTY STATE COMPONENT
// ============================================

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="empty-state">
      <mat-icon>{{ icon }}</mat-icon>
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <button mat-raised-button color="primary" *ngIf="actionLabel" (click)="action.emit()">
        {{ actionLabel }}
      </button>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
    }
    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #cbd5e1;
      margin-bottom: 16px;
    }
    .empty-state h3 {
      margin: 0 0 8px;
      color: #334155;
      font-size: 18px;
      font-weight: 600;
    }
    .empty-state p {
      margin: 0 0 24px;
      color: #64748b;
      font-size: 14px;
      max-width: 400px;
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon = 'inbox';
  @Input() title = 'No data found';
  @Input() message = 'There are no items to display.';
  @Input() actionLabel?: string;
  @Output() action = new EventEmitter<void>();
}

// ============================================
// DATA TABLE COMPONENT - Reusable table
// ============================================

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th *ngFor="let col of columns" 
                [style.width]="col.width" 
                [style.textAlign]="col.align || 'left'">
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of data; let i = index" 
              (click)="rowClick.emit(row)"
              [class.clickable]="rowClick.observers.length > 0">
            <td *ngFor="let col of columns" [style.textAlign]="col.align || 'left'">
              <ng-container *ngIf="!col.key.includes('.'); else nested">
                {{ row[col.key] }}
              </ng-container>
              <ng-template #nested>
                {{ getNestedValue(row, col.key) }}
              </ng-template>
            </td>
          </tr>
          <tr *ngIf="data.length === 0">
            <td [attr.colspan]="columns.length" class="no-data">
              No data available
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .table-container {
      overflow-x: auto;
      border-radius: 12px;
      background: white;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
    }
    .data-table thead {
      background: #f8fafc;
    }
    .data-table th {
      padding: 16px;
      font-weight: 600;
      color: #475569;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #e2e8f0;
    }
    .data-table td {
      padding: 16px;
      color: #334155;
      font-size: 14px;
      border-bottom: 1px solid #f1f5f9;
    }
    .data-table tbody tr {
      transition: background 0.2s;
    }
    .data-table tbody tr:hover {
      background: #f8fafc;
    }
    .data-table tbody tr.clickable {
      cursor: pointer;
    }
    .no-data {
      text-align: center;
      color: #94a3b8;
      padding: 40px !important;
    }
  `]
})
export class DataTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: Record<string, unknown>[] = [];
  @Output() rowClick = new EventEmitter<Record<string, unknown>>();

  getNestedValue(obj: Record<string, unknown>, path: string): string {
    return path.split('.').reduce((acc: unknown, part: string) => 
      acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[part] : undefined, obj) as string ?? '';
  }
}
