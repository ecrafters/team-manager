import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-absence-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification" [class]="type" *ngIf="show">
      <i class="fas" [class]="getIcon()"></i>
      <span class="message">{{ message }}</span>
      <button class="close-btn" (click)="show = false">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `,
  styles: [`
    .notification {
      padding: 1rem;
      border-radius: 6px;
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .success {
      background: #e8f5e9;
      color: #27ae60;
    }

    .error {
      background: #ffebee;
      color: #e74c3c;
    }

    .info {
      background: #e3f2fd;
      color: #3498db;
    }

    .close-btn {
      margin-left: auto;
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      padding: 0.25rem;
    }
  `]
})
export class AbsenceNotificationComponent {
  @Input() message = '';
  @Input() type: 'success' | 'error' | 'info' = 'info';
  show = true;

  getIcon(): string {
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      info: 'fa-info-circle'
    };
    return icons[this.type];
  }
}