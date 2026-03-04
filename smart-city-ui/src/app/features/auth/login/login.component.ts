// ============================================
// LOGIN COMPONENT - Smart City Portal
// Professional authentication component
// ============================================

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <div class="login-background">
        <div class="bg-shape shape-1"></div>
        <div class="bg-shape shape-2"></div>
        <div class="bg-shape shape-3"></div>
      </div>
      
      <mat-card class="login-card">
        <div class="login-header">
          <div class="logo">
            <mat-icon>location_city</mat-icon>
          </div>
          <h1>Smart City Portal</h1>
          <p>Sign in to manage city complaints</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <!-- Email Field -->
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Email Address</mat-label>
            <input matInput formControlName="email" type="email" placeholder="Enter your email">
            <mat-icon matPrefix>email</mat-icon>
            @if (loginForm.get('email')?.hasError('required') && loginForm.get('email')?.touched) {
              <mat-error>Email is required</mat-error>
            }
            @if (loginForm.get('email')?.hasError('email') && loginForm.get('email')?.touched) {
              <mat-error>Please enter a valid email</mat-error>
            }
          </mat-form-field>

          <!-- Password Field -->
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Password</mat-label>
            <input matInput formControlName="password" [type]="hidePassword() ? 'password' : 'text'" placeholder="Enter your password">
            <mat-icon matPrefix>lock</mat-icon>
            <button mat-icon-button matSuffix type="button" (click)="togglePasswordVisibility()">
              <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            @if (loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched) {
              <mat-error>Password is required</mat-error>
            }
          </mat-form-field>

          <!-- Remember Me & Forgot Password -->
          <div class="form-options">
            <mat-checkbox formControlName="rememberMe" color="primary">Remember me</mat-checkbox>
            <a routerLink="/forgot-password" class="forgot-link">Forgot password?</a>
          </div>

          <!-- Error Message -->
          @if (errorMessage()) {
            <div class="error-message">
              <mat-icon>error</mat-icon>
              <span>{{ errorMessage() }}</span>
            </div>
          }

          <!-- Submit Button -->
          <button mat-raised-button color="primary" type="submit" class="submit-btn" [disabled]="isLoading()">
            @if (isLoading()) {
              <mat-spinner diameter="20"></mat-spinner>
              <span>Signing in...</span>
            } @else {
              <span>Sign In</span>
            }
          </button>
        </form>

        <!-- Register Link -->
        <div class="login-footer">
          <p>Don't have an account? <a routerLink="/register">Create Account</a></p>
        </div>

        <!-- Demo Credentials -->
        <div class="demo-credentials">
          <p>Demo Accounts:</p>
          <div class="demo-grid">
            <span><strong>Admin:</strong> admin&#64;smartcity.gov</span>
            <span><strong>Officer:</strong> officer&#64;smartcity.gov</span>
            <span><strong>Citizen:</strong> citizen&#64;smartcity.gov</span>
          </div>
          <p class="demo-note">Password: demo123</p>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    /* ============================================
       LOGIN STYLES - Professional SaaS Look
       ============================================ */

    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      position: relative;
      overflow: hidden;
      padding: 20px;
    }

    /* Animated Background Shapes */
    .login-background {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }

    .bg-shape {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.5;
    }

    .shape-1 {
      width: 400px;
      height: 400px;
      background: #3b82f6;
      top: -100px;
      left: -100px;
      animation: float 20s infinite;
    }

    .shape-2 {
      width: 300px;
      height: 300px;
      background: #8b5cf6;
      bottom: -50px;
      right: -50px;
      animation: float 15s infinite reverse;
    }

    .shape-3 {
      width: 200px;
      height: 200px;
      background: #06b6d4;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation: pulse 10s infinite;
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(30px, 30px); }
    }

    @keyframes pulse {
      0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
      50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.3; }
    }

    /* Login Card */
    .login-card {
      width: 100%;
      max-width: 440px;
      padding: 40px;
      border-radius: 20px;
      background: white;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      position: relative;
      z-index: 10;
    }

    .login-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .logo {
      width: 72px;
      height: 72px;
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.4);
    }

    .logo mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: white;
    }

    .login-header h1 {
      margin: 0 0 8px;
      font-size: 28px;
      font-weight: 700;
      color: #1e293b;
    }

    .login-header p {
      margin: 0;
      color: #64748b;
      font-size: 14px;
    }

    /* Form Styles */
    .login-form {
      display: flex;
      flex-direction: column;
    }

    .form-field {
      width: 100%;
      margin-bottom: 8px;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .forgot-link {
      color: #3b82f6;
      font-size: 14px;
      text-decoration: none;
      font-weight: 500;
    }

    .forgot-link:hover {
      text-decoration: underline;
    }

    /* Error Message */
    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      color: #dc2626;
      font-size: 14px;
      margin-bottom: 16px;
    }

    .error-message mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    /* Submit Button */
    .submit-btn {
      height: 48px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 12px;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      box-shadow: 0 4px 12px -3px rgba(59, 130, 246, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .submit-btn:disabled {
      background: #94a3b8;
      box-shadow: none;
    }

    /* Footer */
    .login-footer {
      text-align: center;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
    }

    .login-footer p {
      margin: 0;
      color: #64748b;
      font-size: 14px;
    }

    .login-footer a {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 600;
    }

    .login-footer a:hover {
      text-decoration: underline;
    }

    /* Demo Credentials */
    .demo-credentials {
      margin-top: 20px;
      padding: 16px;
      background: #f8fafc;
      border-radius: 12px;
      font-size: 12px;
      color: #64748b;
    }

    .demo-credentials p {
      margin: 0 0 8px;
      font-weight: 600;
    }

    .demo-grid {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .demo-note {
      margin-top: 8px !important;
      color: #94a3b8;
      font-style: italic;
    }

    /* Responsive */
    @media (max-width: 480px) {
      .login-card {
        padding: 24px;
      }

      .login-header h1 {
        font-size: 24px;
      }
    }
  `]
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Signals
  protected readonly hidePassword = signal(true);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  // Form
  protected readonly loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  // Methods
  protected togglePasswordVisibility(): void {
    this.hidePassword.update(v => !v);
  }

  protected onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.handleSuccessfulLogin();
      },
      error: (error) => {
        this.errorMessage.set(error.message || 'Login failed. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  private handleSuccessfulLogin(): void {
    const role = this.authService.getRole();
    
    switch (role) {
      case 'ROLE_ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'ROLE_OFFICER':
        this.router.navigate(['/officer/dashboard']);
        break;
      case 'ROLE_CITIZEN':
        this.router.navigate(['/citizen/dashboard']);
        break;
      default:
        this.router.navigate(['/login']);
    }

    this.isLoading.set(false);
  }
}
