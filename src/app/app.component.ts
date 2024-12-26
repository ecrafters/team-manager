import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { FirebaseAuthService } from './core/services/auth/firebase-auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent],
  template: `
    <div class="app-container">
      <main [class.with-sidebar]="isAuthenticated$ | async" class="main-content">
        <router-outlet></router-outlet>
      </main>
      <app-sidebar *ngIf="isAuthenticated$ | async"></app-sidebar>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      height: 100vh;
    }
    .main-content {
      flex: 1;
      overflow-y: auto;
      background-color: #f5f5f5;
      transition: margin-right 0.3s ease;
    }
    .main-content.with-sidebar {
      margin-right: 250px;
    }
  `]
})
export class AppComponent {
  isAuthenticated$: Observable<boolean>;

  constructor(private authService: FirebaseAuthService) {
    this.isAuthenticated$ = this.authService.isAuthenticated();
  }
}