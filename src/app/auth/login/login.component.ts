import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FirebaseAuthService } from '../../core/services/auth/firebase-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
        <h2>Connexion</h2>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            formControlName="email"
            class="form-control"
            placeholder="votre@email.com"
          />
        </div>

        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            formControlName="password"
            class="form-control"
            placeholder="Votre mot de passe"
          />
        </div>

        <div *ngIf="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" [disabled]="!loginForm.valid || isLoading">
          {{ isLoading ? 'Connexion...' : 'Se connecter' }}
        </button>

        <p class="auth-link">
          Pas encore de compte ? <a routerLink="/register">Créer un compte</a>
        </p>
      </form>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 1rem;
      background-color: #f5f5f5;
    }
    .auth-form {
      width: 100%;
      max-width: 400px;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-top: 0.25rem;
    }
    .error-message {
      color: #e74c3c;
      margin-bottom: 1rem;
      text-align: center;
    }
    button {
      width: 100%;
      padding: 0.75rem;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:disabled {
      background: #bdc3c7;
    }
    .auth-link {
      text-align: center;
      margin-top: 1rem;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: FirebaseAuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Login error:', err);
          this.error = 'Email ou mot de passe incorrect';
          this.isLoading = false;
        }
      });
    }
  }
}