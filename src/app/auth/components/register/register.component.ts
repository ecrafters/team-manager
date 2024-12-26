import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FirebaseAuthService } from '../../../core/services/auth/firebase-auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
        <h2>Créer un compte</h2>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            formControlName="email"
            class="form-control"
            placeholder="votre@email.com"
          />
          <div *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.errors" class="error-hint">
            <span *ngIf="registerForm.get('email')?.errors?.['required']">L'email est requis</span>
            <span *ngIf="registerForm.get('email')?.errors?.['email']">Format d'email invalide</span>
          </div>
        </div>

        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            formControlName="password"
            class="form-control"
            placeholder="Minimum 6 caractères"
          />
          <div *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.errors" class="error-hint">
            <span *ngIf="registerForm.get('password')?.errors?.['required']">Le mot de passe est requis</span>
            <span *ngIf="registerForm.get('password')?.errors?.['minlength']">Le mot de passe doit contenir au moins 6 caractères</span>
          </div>
        </div>

        <div *ngIf="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" [disabled]="!registerForm.valid || isLoading">
          {{ isLoading ? 'Création en cours...' : 'Créer un compte' }}
        </button>

        <p class="auth-link">
          Déjà inscrit ? <a routerLink="/login">Se connecter</a>
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
    .error-hint {
      color: #e74c3c;
      font-size: 0.875rem;
      margin-top: 0.25rem;
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
export class RegisterComponent {
  registerForm: FormGroup;
  error: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: FirebaseAuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.error = '';
      const { email, password } = this.registerForm.value;
      
      this.authService.register(email, password).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.error = err.message;
          this.isLoading = false;
        }
      });
    }
  }
}