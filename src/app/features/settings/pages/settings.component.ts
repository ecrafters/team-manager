import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="settings-page">
      <header class="page-header">
        <h1>Paramètres</h1>
      </header>
      
      <div class="settings-grid">
        <!-- Paramètres du profil -->
        <div class="settings-card">
          <h2>Profil</h2>
          <form [formGroup]="profileForm" (ngSubmit)="onSaveProfile()" class="settings-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" formControlName="email" class="form-control">
            </div>
            
            <div class="form-group">
              <label for="language">Langue</label>
              <select id="language" formControlName="language" class="form-control">
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="timezone">Fuseau horaire</label>
              <select id="timezone" formControlName="timezone" class="form-control">
                <option value="Europe/Paris">Europe/Paris</option>
                <option value="UTC">UTC</option>
              </select>
            </div>

            <button type="submit" [disabled]="!profileForm.valid">Enregistrer</button>
          </form>
        </div>

        <!-- Paramètres de sécurité -->
        <div class="settings-card">
          <h2>Sécurité</h2>
          <form [formGroup]="securityForm" (ngSubmit)="onChangePassword()" class="settings-form">
            <div class="form-group">
              <label for="currentPassword">Mot de passe actuel</label>
              <input type="password" id="currentPassword" formControlName="currentPassword" class="form-control">
            </div>
            
            <div class="form-group">
              <label for="newPassword">Nouveau mot de passe</label>
              <input type="password" id="newPassword" formControlName="newPassword" class="form-control">
            </div>
            
            <div class="form-group">
              <label for="confirmPassword">Confirmer le mot de passe</label>
              <input type="password" id="confirmPassword" formControlName="confirmPassword" class="form-control">
            </div>

            <button type="submit" [disabled]="!securityForm.valid">Changer le mot de passe</button>
          </form>
        </div>

        <!-- Paramètres de notification -->
        <div class="settings-card">
          <h2>Notifications</h2>
          <form [formGroup]="notificationForm" (ngSubmit)="onSaveNotifications()" class="settings-form">
            <div class="form-group checkbox">
              <label>
                <input type="checkbox" formControlName="emailNotifications">
                Notifications par email
              </label>
            </div>
            
            <div class="form-group checkbox">
              <label>
                <input type="checkbox" formControlName="absenceNotifications">
                Notifications d'absences
              </label>
            </div>
            
            <div class="form-group checkbox">
              <label>
                <input type="checkbox" formControlName="projectNotifications">
                Notifications de projets
              </label>
            </div>

            <button type="submit">Enregistrer</button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-page {
      padding: 1.5rem;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .settings-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .settings-card h2 {
      margin-bottom: 1.5rem;
      color: #2c3e50;
    }

    .settings-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group.checkbox {
      flex-direction: row;
      align-items: center;
      gap: 0.5rem;
    }

    .form-control {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .form-control:focus {
      outline: none;
      border-color: #3498db;
    }

    button {
      padding: 0.75rem;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      margin-top: 1rem;
    }

    button:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .settings-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SettingsComponent {
  profileForm: FormGroup;
  securityForm: FormGroup;
  notificationForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      language: ['fr'],
      timezone: ['Europe/Paris']
    });

    this.securityForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });

    this.notificationForm = this.fb.group({
      emailNotifications: [true],
      absenceNotifications: [true],
      projectNotifications: [true]
    });
  }

  onSaveProfile(): void {
    if (this.profileForm.valid) {
      console.log('Saving profile settings:', this.profileForm.value);
      // Implement profile update logic
    }
  }

  onChangePassword(): void {
    if (this.securityForm.valid) {
      console.log('Changing password');
      // Implement password change logic
    }
  }

  onSaveNotifications(): void {
    if (this.notificationForm.valid) {
      console.log('Saving notification settings:', this.notificationForm.value);
      // Implement notification settings update logic
    }
  }
}