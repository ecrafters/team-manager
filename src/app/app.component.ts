import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { CommonModule } from "@angular/common";
import { SidebarComponent } from "./shared/components/sidebar/sidebar.component";
import { FirebaseAuthService } from "./core/services/auth/firebase-auth.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent],
  template: `
    <div class="app-container">
      <main
        [class.with-sidebar]="isAuthenticated$ | async"
        [class.no-sidebar]="!(isAuthenticated$ | async)"
        class="main-content"
      >
        <router-outlet></router-outlet>
      </main>
      <app-sidebar
        *ngIf="isAuthenticated$ | async"
        class="sidebar"
      ></app-sidebar>
    </div>
  `,
  styles: [
    `
     .app-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: #f0f2f5;
  position: relative;
  font-family: Arial, sans-serif;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  background: linear-gradient(to bottom, #ffffff, #f7f9fc);
  transition: margin-left 0.4s ease, transform 0.4s ease;
  box-shadow: inset 0px 4px 8px rgba(0, 0, 0, 0.05);
}

.main-content.no-sidebar {
  margin-left: 0;
  transform: scale(1);
}

.main-content.with-sidebar {
  margin-left: 250px;
  transform: scale(0.98);
}


/* General Improvements */
body {
  margin: 0;
  background-color: #f0f2f5;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  color: #2c3e50;
}

button {
  background: #3498db;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

button:hover {
  background: #2980b9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}


    `,
  ],
})
export class AppComponent {
  isAuthenticated$: Observable<boolean>;

  constructor(private authService: FirebaseAuthService) {
    this.isAuthenticated$ = this.authService.isAuthenticated();
  }
}
