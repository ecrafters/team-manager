import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="item-card" [ngClass]="status">
      <div class="card-header">
        <div class="header-content">
          <span class="badge" *ngIf="badge">{{ badge }}</span>
          <h3 class="title">{{ title }}</h3>
        </div>
        <div class="actions" *ngIf="showActions">
          <button class="btn-icon" (click)="onEdit.emit()">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-icon" (click)="onDelete.emit()">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>

      <div class="card-content">
        <ng-content></ng-content>
      </div>

      <div class="card-footer" *ngIf="footerContent">
        {{ footerContent }}
      </div>
    </div>
  `,
  styles: [`
    .item-card {
      background: white;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .title {
      margin: 0;
      font-size: 1.1rem;
      color: #2c3e50;
    }

    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.875rem;
      background: #e3f2fd;
      color: #2196f3;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-icon {
      background: none;
      border: none;
      color: #666;
      cursor: pointer;
      padding: 0.25rem;
      transition: color 0.3s;
    }

    .btn-icon:hover {
      color: #333;
    }

    .card-content {
      margin-bottom: 1rem;
    }

    .card-footer {
      padding-top: 0.5rem;
      border-top: 1px solid #eee;
      color: #666;
      font-size: 0.875rem;
    }

    /* Status styles */
    .pending .badge { 
      background: #fff3e0;
      color: #f57c00;
    }

    .approved .badge,
    .active .badge {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .rejected .badge,
    .completed .badge {
      background: #ffebee;
      color: #c62828;
    }

    .on-hold .badge {
      background: #f3e5f5;
      color: #7b1fa2;
    }
  `]
})
export class ItemCardComponent {
  @Input() title = '';
  @Input() badge = '';
  @Input() status = '';
  @Input() footerContent = '';
  @Input() showActions = true;

  @Output() onEdit = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<void>();
}