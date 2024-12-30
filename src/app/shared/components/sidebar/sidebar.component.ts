import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FirebaseAuthService } from '../../../core/services/auth/firebase-auth.service';
import { UserService } from '../../../core/services/user.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <i class="fas fa-users-cog"></i>
          <h2>Team Manager</h2>
        </div>
        <div class="user-info" *ngIf="isAuthenticated$ | async">
          <a routerLink="/profile" class="profile-link">
            <img [src]="userAvatar$ | async" alt="Photo de profil" class="user-avatar">
            <div class="user-details">
              <span class="user-name">{{ userName$ | async }}</span>
              <span class="user-role">{{ userRole$ | async }}</span>
            </div>
          </a>
        </div>
      </div>

      <div class="nav-section">
        <ul class="nav-links">
          <li>
            <a routerLink="/dashboard" routerLinkActive="active">
              <i class="fas fa-home"></i>
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a routerLink="/absences" routerLinkActive="active">
              <i class="fas fa-calendar-alt"></i>
              <span>Absences</span>
            </a>
          </li>
         <!-- TODO
          <li *ngIf="isManager$ | async">
            <a routerLink="/absences/validation" routerLinkActive="active">
              <i class="fas fa-check-circle"></i>
              <span>Validation des absences</span>
            </a>
          </li>
          -->
          <li>
            <a routerLink="/workload" routerLinkActive="active">
              <i class="fas fa-tasks"></i>
              <span>Charge de travail</span>
            </a>
          </li>
          <li>
            <a routerLink="/projects" routerLinkActive="active">
              <i class="fas fa-project-diagram"></i>
              <span>Projets</span>
            </a>
          </li>
          <li>
            <a routerLink="/team" routerLinkActive="active">
              <i class="fas fa-users"></i>
              <span>Équipe</span>
            </a>
          </li>
        </ul>
      </div>

      <div class="sidebar-footer">
        <ul class="nav-links">
          <li>
            <a routerLink="/settings" routerLinkActive="active">
              <i class="fas fa-cog"></i>
              <span>Paramètres</span>
            </a>
          </li>
          <li *ngIf="!(isAuthenticated$ | async)">
            <a routerLink="/login" class="login-link">
              <i class="fas fa-sign-in-alt"></i>
              <span>Connexion</span>
            </a>
          </li>
          <li *ngIf="isAuthenticated$ | async">
            <button class="logout-btn" (click)="logout()">
              <i class="fas fa-sign-out-alt"></i>
              <span>Déconnexion</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  `,
  styles: [`
    .sidebar {
      width: 280px;
      height: 100vh;
      background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
      color: #ecf0f1;
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1000;
      box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
        transition: transform 3s ease;
    }

      @media (max-width: 768px) {
        .sidebar {
          position: absolute;
          transform: translateX(-100%);
          z-index: 1000;
        }
        .main-content.with-sidebar {
          margin-left: 0;
        }
      }

      .sidebar-open .sidebar {
        transform: translateX(0);
      }

      .sidebar-open .main-content {
        margin-left: 250px;
      }

    .sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .logo i {
      font-size: 1.75rem;
      color: #3498db;
      filter: drop-shadow(0 2px 4px rgba(52, 152, 219, 0.3));
    }

    .logo h2 {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
      background: linear-gradient(45deg, #3498db, #2ecc71);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .user-info {
      padding: 0.75rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      backdrop-filter: blur(10px);
    }

    .profile-link {
      display: flex;
      align-items: center;
      gap: 1rem;
      text-decoration: none;
      color: inherit;
      padding: 0.5rem;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .profile-link:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateX(-4px);
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-weight: 500;
      font-size: 0.95rem;
    }

    .user-role {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.7);
    }

    .nav-section {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem 0;
    }

    .nav-links {
      list-style: none;
      padding: 0 1rem;
      margin: 0;
    }

    .nav-links li {
      margin-bottom: 0.5rem;
    }

    .nav-links a {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.875rem 1.25rem;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .nav-links a:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
      transform: translateX(-4px);
    }

    .nav-links a.active {
      color: white;
      background: linear-gradient(45deg, #3498db, #2ecc71);
      box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
    }

    .nav-links i {
      width: 20px;
      text-align: center;
      font-size: 1.1rem;
    }

    .sidebar-footer {
      padding: 1.5rem 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logout-btn {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.875rem 1.25rem;
      background: rgba(231, 76, 60, 0.1);
      color: #e74c3c;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .logout-btn:hover {
      background: rgba(231, 76, 60, 0.2);
      transform: translateX(-4px);
    }

    .login-link {
      background: linear-gradient(45deg, #3498db, #2ecc71);
      color: white !important;
      font-weight: 500;
    }

    /* Scrollbar personnalisé */
    .nav-section::-webkit-scrollbar {
      width: 6px;
    }

    .nav-section::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 3px;
    }

    .nav-section::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
    }

    .nav-section::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    /* Animation des icônes */
    .nav-links a:hover i {
      transform: scale(1.1);
      transition: transform 0.3s ease;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .sidebar {
        width: 100%;
        transform: translateX(100%);
        transition: transform 0.3s ease;
      }

      .sidebar.open {
        transform: translateX(0);
      }
    }
  `]
})
export class SidebarComponent {
  isAuthenticated$: Observable<boolean>;
  isManager$: Observable<boolean>;
  userName$: Observable<string>;
  userAvatar$: Observable<string>;
  userRole$: Observable<string>;

  constructor(
    private authService: FirebaseAuthService,
    private userService: UserService
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated();
    this.isManager$ = this.userService.getCurrentUser().pipe(
      map(user => user?.role === 'admin' || user?.role === 'manager')
    );
    this.userName$ = this.userService.getCurrentUser().pipe(
      map(user => user ? `${user.firstName} ${user.lastName}` : 'Utilisateur')
    );
    this.userAvatar$ = this.userService.getCurrentUser().pipe(
      map(user => user?.avatar || 'assets/default-avatar.png')
    );
    this.userRole$ = this.userService.getCurrentUser().pipe(
      map(user => {
        const roles = {
          admin: 'Administrateur',
          manager: 'Manager',
          developer: 'Développeur',
          crafters: 'Artisans',
          quickwins: 'Quick Wins',
          onboard: 'Onboard',
          marketing: 'Marketing',
          tester: 'Testeur',
          devops: 'DevOps',
          commercial: 'Commercial',
          accounting: 'Comptabilité',
          rh: 'Ressources Humaines'
        };
        return user ? roles[user.role] : '';
      })
    );
  }

  logout(): void {
    this.authService.logout().subscribe();
  }
}