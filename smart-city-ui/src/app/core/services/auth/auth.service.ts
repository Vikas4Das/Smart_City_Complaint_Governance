// ============================================
// AUTH SERVICE - Enterprise Grade
// Handles all authentication operations with JWT
// ============================================

import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { catchError, map, tap, finalize } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

import { 
  User, 
  AuthCredentials, 
  AuthResponse, 
  RegisterData,
  UserRole 
} from '../../models';

import { environment } from '../../../../environments/environment';

interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  exp: number;
  iat: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // ============================================
  // INJECTIONS
  // ============================================
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // ============================================
  // PRIVATE PROPERTIES
  // ============================================
  private readonly apiUrl = environment.apiUrl;
  private readonly tokenKey = 'smart_city_token';
  private readonly userKey = 'smart_city_user';

  // ============================================
  // SIGNALS - Angular 17+ Reactive State
  // ============================================
  private readonly _user = signal<User | null>(this.getStoredUser());
  private readonly _token = signal<string | null>(this.getStoredToken());
  private readonly _isAuthenticated = signal<boolean>(this.hasValidToken());
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // ============================================
  // COMPUTED VALUES
  // ============================================
  readonly user = this._user.asReadonly();
  readonly token = this._token.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  
  readonly userRole = computed(() => this._user()?.role ?? null);
  readonly isAdmin = computed(() => this._user()?.role === UserRole.ADMIN);
  readonly isOfficer = computed(() => this._user()?.role === UserRole.OFFICER);
  readonly isCitizen = computed(() => this._user()?.role === UserRole.CITIZEN);

  // ============================================
  // CONSTRUCTOR
  // ============================================
  constructor() {
    this.validateTokenOnInit();
  }

  // ============================================
  // PUBLIC METHODS
  // ============================================

  /**
   * Login with email and password
   */
  login(credentials: AuthCredentials): Observable<AuthResponse> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => this.handleAuthSuccess(response)),
      catchError(error => this.handleError(error)),
      finalize(() => this._isLoading.set(false))
    );
  }

  /**
   * Register new user
   */
  register(data: RegisterData): Observable<AuthResponse> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, data).pipe(
      tap(response => this.handleAuthSuccess(response)),
      catchError(error => this.handleError(error)),
      finalize(() => this._isLoading.set(false))
    );
  }

  /**
   * Logout and clear session
   */
  logout(): void {
    this.clearStorage();
    this._user.set(null);
    this._token.set(null);
    this._isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  /**
   * Get current JWT token
   */
  getToken(): string | null {
    return this._token();
  }

  /**
   * Get user role from token
   */
  getRole(): UserRole | null {
    const token = this._token();
    if (!token) return null;
    
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.role as UserRole;
    } catch {
      return null;
    }
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return this._isAuthenticated();
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    const token = this._token();
    if (!token) return true;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  }

  /**
   * Refresh authentication token
   */
  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/refresh`, {
      token: this._token()
    }).pipe(
      tap(response => this.handleAuthSuccess(response)),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  /**
   * Update user profile
   */
  updateProfile(data: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/profile`, data).pipe(
      tap(user => {
        this._user.set(user);
        localStorage.setItem(this.userKey, JSON.stringify(user));
      })
    );
  }

  /**
   * Change password
   */
  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/change-password`, {
      currentPassword,
      newPassword
    });
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private handleAuthSuccess(response: AuthResponse): void {
    this._token.set(response.token);
    this._user.set(response.user);
    this._isAuthenticated.set(true);
    
    this.saveToStorage(response.token, response.user);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred during authentication';
    
    if (error.status === 401) {
      errorMessage = 'Invalid email or password';
    } else if (error.status === 403) {
      errorMessage = 'Account is locked or disabled';
    } else if (error.status === 0) {
      errorMessage = 'Unable to connect to server. Please check your connection.';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }

    this._error.set(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private saveToStorage(token: string, user: User): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  private clearStorage(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  private getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.tokenKey);
  }

  private getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(this.userKey);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  }

  private hasValidToken(): boolean {
    const token = this.getStoredToken();
    if (!token) return false;
    
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  }

  private validateTokenOnInit(): void {
    if (this.isTokenExpired()) {
      this.logout();
    }
  }
}
