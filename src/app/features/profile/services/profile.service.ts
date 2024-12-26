import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { UserProfile } from '../models/profile.model';
import { FirebaseAuthService } from '../../../core/services/auth/firebase-auth.service';
import { UserService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(
    private authService: FirebaseAuthService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  getCurrentUserProfile(): Observable<UserProfile | null> {
    return this.userService.getCurrentUser().pipe(
      map(user => {
        if (!user) return null;
        
        return {
          ...user,
          preferences: {
            language: 'fr',
            theme: 'light' as const,
            notifications: {
              email: true,
              browser: true
            }
          }
        };
      })
    );
  }

  updateProfile(profileData: Partial<UserProfile>): Observable<void> {
    return this.userService.updateCurrentUser(profileData).pipe(
      map(() => {
        this.notificationService.success('Profil mis à jour avec succès');
      })
    );
  }

  updateAvatar(file: File): Observable<string> {
    return this.userService.updateUserAvatar(file);
  }

  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    // Implement password change logic using Firebase Auth
    return new Observable(subscriber => {
      // Mock implementation
      setTimeout(() => {
        this.notificationService.success('Mot de passe mis à jour avec succès');
        subscriber.next();
        subscriber.complete();
      }, 1000);
    });
  }
}