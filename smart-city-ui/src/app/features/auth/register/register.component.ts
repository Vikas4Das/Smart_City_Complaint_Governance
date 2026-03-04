// ============================================
// REGISTER COMPONENT - Smart City Portal
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
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../core/services/auth/auth.service';
import { UserRole } from '../../../core/models';

@Component({
  selector: 'app-register',
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
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="register-container">
      <div class="register-background">
        <div class="bg-shape shape-1"></div>
        <div class="bg-shape shape-2"></div>
      </div>
      
      <mat-card class="register-card">
        <div class="register-header">
          <div class="logo">
            <mat-icon>location_city</mat-icon>
          </div>
          <h1>Create Account</h1>
          <p>Join Smart City Portal</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>First Name</mat-label>
              <input matInput formControlName="firstName" placeholder="First name">
              <mat-icon matPrefix>person</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Last Name</mat-label>
              <input matInput formControlName="lastName" placeholder="Last name">
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Email Address</mat-label>
            <input matInput formControlName="email" type="email" placeholder="Enter your email">
            <mat-icon matPrefix>email</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Password</mat-label>
            <input matInput formControlName="password" [type]="hidePassword() ? 'password' : 'text'" placeholder="Create password">
            <mat-icon matPrefix>lock</mat-icon>
            <button mat-icon-button matSuffix type="button" (click)="togglePassword()">
              <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Account Type</mat-label>
            <mat-select formControlName="role">
              <mat-option value="ROLE_CITIZEN">Citizen</mat-option>
            </mat-select>
            <mat-icon matPrefix>badge</mat-icon>
          </mat-form-field>

          @if (errorMessage()) {
            <div class="error-message">
              <mat-icon>error</mat-icon>
              <span>{{ errorMessage() }}</span>
            </div>
          }

          <button mat-raised-button color="primary" type="submit" class="submit-btn" [disabled]="isLoading()">
            @if (isLoading()) {
              <mat-spinner diameter="20"></mat-spinner>
              <span>Creating account...</span>
            } @else {
              <span>Create Account</span>
            }
          </button>
        </form>

        <div class="register-footer">
          <p>Already have an account? <a routerLink="/login">Sign In</a></p>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      position: relative;
      overflow: hidden;
      padding: 20px;
    }

    .register-background {
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
      right: -100px;
    }

    .shape-2 {
      width: 300px;
      height: 300px;
      background: #8b5cf6;
      bottom: -50px;
      left: -50px;
    }

    .register-card {
      width: 100%;
      max-width: 480px;
      padding: 40px;
      border-radius: 20px;
      background: white;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      position: relative;
      z-index: 10;
    }

    .register-header {
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

    .register-header h1 {
      margin: 0 0 8px;
      font-size: 28px;
      font-weight: 700;
      color: #1e293b;
    }

    .register-header p {
      margin: 0;
      color: #64748b;
      font-size: 14px;
    }

    .register-form {
      display: flex;
      flex-direction: column;
    }

    .form-row {
      display: flex;
      gap: 16px;
    }

    .form-row .form-field {
      flex: 1;
    }

    .form-field {
      width: 100%;
      margin-bottom: 8px;
    }

    .submit-btn {
      height: 48px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 12px;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      margin-top: 16px;
    }

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

    .register-footer {
      text-align: center;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
    }

    .register-footer p {
      margin: 0;
      color: #64748b;
      font-size: 14px;
    }

    .register-footer a {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 600;
    }

    @media (max-width: 480px) {
      .register-card {
        padding: 24px;
      }

      .form-row {
        flex-direction: column;
        gap: 0;
      }
    }
  `]
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly hidePassword = signal(true);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly registerForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: [UserRole.CITIZEN, [Validators.required]]
  });

  protected togglePassword(): void {
    this.hidePassword.update(v => !v);
  }

  protected onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.router.navigate(['/login']);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.message || 'Registration failed');
        this.isLoading.set(false);
      }
    });
  }
}
