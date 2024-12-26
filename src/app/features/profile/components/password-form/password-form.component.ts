import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-password-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="passwordForm" (ngSubmit)="onSubmit()" class="password-form">
      <h3>Changer le mot de passe</h3>

      <div class="form-group">
        <label for="currentPassword">Mot de passe actuel</label>
        <input 
          type="password" 
          id="currentPassword" 
          formControlName="currentPassword" 
          class="form-control"
        >
      </div>

      <div class="form-group">
        <label for="newPassword">Nouveau mot de passe</label>
        <input 
          type="password" 
          id="newPassword" 
          formControlName="newPassword" 
          class="form-control"
        >
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirmer le mot de passe</label>
        <input 
          type="password" 
          id="confirmPassword" 
          formControlName="confirmPassword" 
          class="form-control"
        >
        <div *ngIf="passwordForm.errors?.['passwordMismatch']" class="error-message">
          Les mots de passe ne correspondent pas
        </div>
      </div>

      <button type="submit" [disabled]="!passwordForm.valid || isSubmitting">
        {{ isSubmitting ? 'Modification...' : 'Modifier le mot de passe' }}
      </button>
    </form>
  `,
  styles: [`
    .password-form {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .form-group {
      margin-bottom: 1.5rem;
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
      cursor: not-allowed;
    }
  `]
})
export class PasswordFormComponent {
  passwordForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.passwordForm.valid) {
      this.isSubmitting = true;
      const { currentPassword, newPassword } = this.passwordForm.value;

      this.profileService.changePassword(currentPassword, newPassword).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.passwordForm.reset();
        },
        error: (error: Error) => {
          console.error('Error updating password:', error);
          this.isSubmitting = false;
        }
      });
    }
  }
}