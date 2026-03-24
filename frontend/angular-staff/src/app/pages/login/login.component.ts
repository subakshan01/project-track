import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-page">
      <div class="login-card">
        <h1>TechTrack</h1>
        <p class="subtitle">Staff Portal Login</p>
        <form (ngSubmit)="onLogin()">
          <div class="form-group">
            <label>Email Address</label>
            <input class="form-input" type="email" [(ngModel)]="email" name="email" placeholder="your.email@techtrack.edu" required>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input class="form-input" type="password" [(ngModel)]="password" name="password" placeholder="Enter your password" required>
          </div>
          <div *ngIf="error" style="color:var(--accent-red);font-size:0.9rem;margin-bottom:1rem">{{error}}</div>
          <button type="submit" class="btn btn-primary" [disabled]="loading" style="width:100%;justify-content:center;padding:12px;font-size:1rem">
            {{loading ? 'Signing in...' : 'Sign In'}}
          </button>
        </form>
        <p style="text-align:center;margin-top:1.25rem;color:var(--text-secondary);font-size:0.9rem">
          New staff? <a routerLink="/register" style="color:var(--accent-blue);text-decoration:none;font-weight:500">Register here</a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = ''; password = ''; error = ''; loading = false;
  constructor(private auth: AuthService, private router: Router) {
    if (auth.isLoggedIn) router.navigate(['/']);
  }
  onLogin() {
    this.loading = true; this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: () => { this.router.navigate(['/']); },
      error: (err) => { this.error = err.error?.message || 'Login failed'; this.loading = false; }
    });
  }
}

