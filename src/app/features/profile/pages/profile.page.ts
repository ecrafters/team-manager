import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileFormComponent } from '../components/profile-form/profile-form.component';
import { PasswordFormComponent } from '../components/password-form/password-form.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ProfileFormComponent, PasswordFormComponent],
  template: `
    <div class="profile-page">
      <header class="page-header">
        <h1>Mon profil</h1>
      </header>

      <div class="profile-content">
        <app-profile-form></app-profile-form>
        <app-password-form></app-password-form>
      </div>
    </div>
  `,
  styles: [`
    .profile-page {
      padding: 1.5rem;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .profile-content {
      display: grid;
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class ProfilePage {}