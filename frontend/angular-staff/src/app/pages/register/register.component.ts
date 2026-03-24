import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-page">
      <div class="login-card">
        <h1>TechTrack</h1>
        <p class="subtitle">Staff Registration</p>

        <div *ngIf="successMessage" style="background:rgba(16,185,129,0.15);border:1px solid var(--accent-green);color:var(--accent-green);padding:12px;border-radius:8px;margin-bottom:1rem;text-align:center">
          <p style="margin:0 0 8px">{{ successMessage }}</p>
          <a routerLink="/login" style="color:var(--accent-blue);text-decoration:underline;font-weight:500">Go to Login</a>
        </div>

        <form *ngIf="!successMessage" [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Full Name</label>
            <input class="form-input" type="text" formControlName="name" placeholder="Enter your full name">
            <div *ngIf="form.get('name')?.invalid && form.get('name')?.touched" class="field-error">Name is required</div>
          </div>
          <div class="form-group">
            <label>Email Address</label>
            <input class="form-input" type="email" formControlName="email" placeholder="your.email&#64;techtrack.edu">
            <div *ngIf="form.get('email')?.invalid && form.get('email')?.touched" class="field-error">
              {{ form.get('email')?.errors?.['required'] ? 'Email is required' : 'Enter a valid email' }}
            </div>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input class="form-input" type="password" formControlName="password" placeholder="Minimum 6 characters">
            <div *ngIf="form.get('password')?.invalid && form.get('password')?.touched" class="field-error">
              {{ form.get('password')?.errors?.['required'] ? 'Password is required' : 'Password must be at least 6 characters' }}
            </div>
          </div>
          <div class="form-group">
            <label>Department</label>
            <input class="form-input" type="text" formControlName="department" placeholder="e.g. Computer Science">
            <div *ngIf="form.get('department')?.invalid && form.get('department')?.touched" class="field-error">Department is required</div>
          </div>

          <div *ngIf="error" style="color:var(--accent-red);font-size:0.9rem;margin-bottom:1rem">{{ error }}</div>

          <button type="submit" class="btn btn-primary" [disabled]="loading || form.invalid" style="width:100%;justify-content:center;padding:12px;font-size:1rem">
            {{ loading ? 'Registering...' : 'Register' }}
          </button>
        </form>

        <p *ngIf="!successMessage" style="text-align:center;margin-top:1.25rem;color:var(--text-secondary);font-size:0.9rem">
          Already have an account? <a routerLink="/login" style="color:var(--accent-blue);text-decoration:none;font-weight:500">Sign in here</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .field-error {
      color: var(--accent-red);
      font-size: 0.8rem;
      margin-top: 4px;
    }
  `]
})
export class RegisterComponent {
  form: FormGroup;
  error = '';
  successMessage = '';
  loading = false;

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      department: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    this.auth.registerStaff(this.form.value).subscribe({
      next: (res: any) => {
        this.successMessage = res.message || 'Staff registered successfully';
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || err.error?.errors?.[0]?.msg || 'Registration failed';
        this.loading = false;
      }
    });
  }
}
