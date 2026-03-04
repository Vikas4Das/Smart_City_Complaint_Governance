// ============================================
// COMPLAINT SERVICE - Enterprise Grade
// Handles all complaint-related operations
// ============================================

import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, tap, retry, shareReplay, finalize } from 'rxjs/operators';

import { 
  Complaint, 
  ComplaintFilter, 
  DashboardStats,
  ComplaintStatus,
  ComplaintCategory,
  ComplaintPriority,
  PaginatedResponse,
  ApiResponse 
} from '../../models';

import { AuthService } from '../auth/auth.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  // ============================================
  // INJECTIONS
  // ============================================
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  // ============================================
  // PRIVATE PROPERTIES
  // ============================================
  private readonly apiUrl = `${environment.apiUrl}/complaints`;

  // ============================================
  // SIGNALS - Reactive State
  // ============================================
  private readonly _complaints = signal<Complaint[]>([]);
  private readonly _selectedComplaint = signal<Complaint | null>(null);
  private readonly _stats = signal<DashboardStats | null>(null);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _filters = signal<ComplaintFilter>({
    page: 1,
    pageSize: 10
  });

  // ============================================
  // COMPUTED VALUES
  // ============================================
  readonly complaints = this._complaints.asReadonly();
  readonly selectedComplaint = this._selectedComplaint.asReadonly();
  readonly stats = this._stats.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly filters = this._filters.asReadonly();

  // ============================================
  // PUBLIC METHODS - COMPLAINTS CRUD
  // ============================================

  /**
   * Get all complaints with pagination and filters
   */
  getComplaints(filters?: Partial<ComplaintFilter>): Observable<PaginatedResponse<Complaint>> {
    this._isLoading.set(true);
    this._error.set(null);

    let params = new HttpParams()
      .set('page', filters?.page?.toString() ?? '1')
      .set('pageSize', filters?.pageSize?.toString() ?? '10');

    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.category) params = params.set('category', filters.category);
    if (filters?.priority) params = params.set('priority', filters.priority);
    if (filters?.searchTerm) params = params.set('search', filters.searchTerm);
    if (filters?.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters?.sortOrder) params = params.set('sortOrder', filters.sortOrder);

    return this.http.get<PaginatedResponse<Complaint>>(this.apiUrl, { params }).pipe(
      tap(response => {
        this._complaints.set(response.items);
        this._filters.set({ ...this._filters(), ...filters, page: response.currentPage });
      }),
      catchError(error => this.handleError(error)),
      finalize(() => this._isLoading.set(false)),
      shareReplay(1)
    );
  }

  /**
   * Get single complaint by ID
   */
  getComplaintById(id: string): Observable<Complaint> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.get<ApiResponse<Complaint>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data),
      tap(complaint => this._selectedComplaint.set(complaint)),
      catchError(error => this.handleError(error)),
      finalize(() => this._isLoading.set(false)),
      shareReplay(1)
    );
  }

  /**
   * Create new complaint
   */
  createComplaint(complaint: Partial<Complaint>): Observable<Complaint> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.post<ApiResponse<Complaint>>(this.apiUrl, complaint).pipe(
      map(response => response.data),
      tap(newComplaint => {
        const current = this._complaints();
        this._complaints.set([newComplaint, ...current]);
      }),
      catchError(error => this.handleError(error)),
      finalize(() => this._isLoading.set(false))
    );
  }

  /**
   * Update complaint
   */
  updateComplaint(id: string, updates: Partial<Complaint>): Observable<Complaint> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.patch<ApiResponse<Complaint>>(`${this.apiUrl}/${id}`, updates).pipe(
      map(response => response.data),
      tap(updatedComplaint => {
        const current = this._complaints();
        const index = current.findIndex(c => c.id === id);
        if (index !== -1) {
          const updated = [...current];
          updated[index] = updatedComplaint;
          this._complaints.set(updated);
        }
        if (this._selectedComplaint()?.id === id) {
          this._selectedComplaint.set(updatedComplaint);
        }
      }),
      catchError(error => this.handleError(error)),
      finalize(() => this._isLoading.set(false))
    );
  }

  /**
   * Delete complaint
   */
  deleteComplaint(id: string): Observable<void> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(() => undefined),
      tap(() => {
        const current = this._complaints();
        this._complaints.set(current.filter(c => c.id !== id));
      }),
      catchError(error => this.handleError(error)),
      finalize(() => this._isLoading.set(false))
    );
  }

  // ============================================
  // PUBLIC METHODS - DASHBOARD STATS
  // ============================================

  /**
   * Get dashboard statistics
   */
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.apiUrl}/stats`).pipe(
      map(response => response.data),
      tap(stats => this._stats.set(stats)),
      catchError(error => {
        // Return mock data for demo purposes
        const mockStats: DashboardStats = {
          totalComplaints: 1250,
          pendingComplaints: 180,
          inProgressComplaints: 95,
          resolvedComplaints: 975,
          todayComplaints: 45,
          averageResolutionTime: 3.2,
          satisfactionRate: 87.5
        };
        this._stats.set(mockStats);
        return of(mockStats);
      }),
      shareReplay(1)
    );
  }

  /**
   * Get complaints by status
   */
  getComplaintsByStatus(status: ComplaintStatus): Observable<Complaint[]> {
    return this.getComplaints({ status, pageSize: 100 }).pipe(
      map(response => response.items)
    );
  }

  /**
   * Get complaints by category
   */
  getComplaintsByCategory(category: ComplaintCategory): Observable<Complaint[]> {
    return this.getComplaints({ category, pageSize: 100 }).pipe(
      map(response => response.items)
    );
  }

  // ============================================
  // PUBLIC METHODS - ASSIGNMENTS
  // ============================================

  /**
   * Assign complaint to officer
   */
  assignComplaint(complaintId: string, officerId: string): Observable<Complaint> {
    return this.updateComplaint(complaintId, {
      assignedTo: officerId,
      status: ComplaintStatus.IN_PROGRESS
    });
  }

  /**
   * Update complaint status
   */
  updateStatus(complaintId: string, status: ComplaintStatus): Observable<Complaint> {
    const updates: Partial<Complaint> = { status };
    
    if (status === ComplaintStatus.RESOLVED) {
      updates.resolvedAt = new Date();
    }

    return this.updateComplaint(complaintId, updates);
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred while processing your request';
    
    if (error.status === 404) {
      errorMessage = 'Resource not found';
    } else if (error.status === 403) {
      errorMessage = 'You do not have permission to perform this action';
    } else if (error.status === 401) {
      errorMessage = 'Your session has expired. Please login again.';
      this.authService.logout();
    } else if (error.status === 0) {
      errorMessage = 'Unable to connect to server';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }

    this._error.set(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Clear selected complaint
   */
  clearSelectedComplaint(): void {
    this._selectedComplaint.set(null);
  }

  /**
   * Clear all errors
   */
  clearError(): void {
    this._error.set(null);
  }
}
