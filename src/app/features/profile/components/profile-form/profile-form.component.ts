import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { UserProfile } from '../../models/profile.model';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="profile-form">
      <div class="avatar-section">
        <img [src]="avatarUrl" alt="Photo de profil" class="avatar">
        <div class="avatar-upload">
          <label for="avatar" class="upload-btn">
            <i class="fas fa-camera"></i>
            Changer la photo
          </label>
          <input 
            type="file" 
            id="avatar" 
            (change)="onFileSelected($event)"
            accept="image/*"
            style="display: none"
          >
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label for="firstName">Prénom</label>
          <input type="text" id="firstName" formControlName="firstName" class="form-control">
        </div>

        <div class="form-group">
          <label for="lastName">Nom</label>
          <input type="text" id="lastName" formControlName="lastName" class="form-control">
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" formControlName="email" class="form-control">
        </div>

        <div class="form-group">
          <label for="phone">Téléphone</label>
          <input type="tel" id="phone" formControlName="phone" class="form-control">
        </div>

        <div class="form-group">
          <label for="department">Département</label>
          <input type="text" id="department" formControlName="department" class="form-control">
        </div>
      </div>

      <div class="preferences-section">
        <h3>Préférences</h3>
        
        <div class="form-group">
          <label for="language">Langue</label>
          <select id="language" formControlName="language" class="form-control">
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </div>

        <div class="form-group">
          <label for="theme">Thème</label>
          <select id="theme" formControlName="theme" class="form-control">
            <option value="light">Clair</option>
            <option value="dark">Sombre</option>
          </select>
        </div>

        <div class="notifications-group">
          <label>Notifications</label>
          <div class="checkbox-group">
            <label>
              <input type="checkbox" formControlName="emailNotifications">
              Notifications par email
            </label>
            <label>
              <input type="checkbox" formControlName="browserNotifications">
              Notifications navigateur
            </label>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" [disabled]="!profileForm.valid || isSubmitting">
          {{ isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications' }}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .profile-form {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .avatar-section {
      text-align: center;
      margin-bottom: 2rem;
    }

    .avatar {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: 1rem;
      border: 3px solid #f5f5f5;
    }

    .upload-btn {
      background: #3498db;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-control {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .preferences-section {
      margin-bottom: 2rem;
    }

    .notifications-group {
      margin-top: 1rem;
    }

    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .form-actions {
      text-align: right;
    }

    button {
      padding: 0.75rem 1.5rem;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }

    button:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
    }
  `]
})
export class ProfileFormComponent implements OnInit {
  profileForm: FormGroup;
  isSubmitting = false;
  avatarUrl = 'assets/default-avatar.png';

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      department: [''],
      language: ['fr'],
      theme: ['light'],
      emailNotifications: [true],
      browserNotifications: [true]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    this.profileService.getCurrentUserProfile().subscribe({
      next: (profile) => {
        if (profile) {
          this.profileForm.patchValue({
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            phone: profile.phone,
            department: profile.department,
            language: profile.preferences.language,
            theme: profile.preferences.theme,
            emailNotifications: profile.preferences.notifications.email,
            browserNotifications: profile.preferences.notifications.browser
          });
          this.avatarUrl = profile.avatar || this.avatarUrl;
        }
      },
      error: (error) => console.error('Error loading profile:', error)
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.profileService.updateAvatar(file).subscribe({
        next: (url) => this.avatarUrl = url,
        error: (error) => console.error('Error updating avatar:', error)
      });
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isSubmitting = true;
      const formData = this.profileForm.value;
      
      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        preferences: {
          language: formData.language,
          theme: formData.theme,
          notifications: {
            email: formData.emailNotifications,
            browser: formData.browserNotifications
          }
        }
      };

      this.profileService.updateProfile(profileData).subscribe({
        next: () => this.isSubmitting = false,
        error: (error) => {
          console.error('Error updating profile:', error);
          this.isSubmitting = false;
        }
      });
    }
  }
}