import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  credentials = { email: '', password: '' };

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login(this.credentials).subscribe((res: any) => {
      this.auth.saveToken(res.token);
      const role = this.auth.getRole();
      if (role === 'ROLE_ADMIN') this.router.navigate(['/admin']);
      if (role === 'ROLE_OFFICER') this.router.navigate(['/officer']);
      if (role === 'ROLE_CITIZEN') this.router.navigate(['/citizen']);
    });
  }
}
