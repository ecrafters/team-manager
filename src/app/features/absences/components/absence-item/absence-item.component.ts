import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Absence } from '../../models/absence.model';
import { MemberService } from '../../services/member.service';

@Component({
  selector: 'app-absence-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="absence-item" [ngClass]="absence.status">
      <div class="absence-header">
        <span class="type-badge">{{ getAbsenceType(absence.type) }}</span>
        <div class="actions">
          <button class="btn-icon" (click)="onEdit()">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-icon" (click)="onDelete()">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>

      <div class="member-info">
        <img [src]="memberService.getMemberAvatar(absence.userId)" 
             [alt]="memberService.getMemberName(absence.userId)"
             class="member-avatar">
        <span class="member-name">{{ memberService.getMemberName(absence.userId) }}</span>
      </div>
      
      <div class="absence-dates">
        <div class="date">
          <span class="label">Début:</span>
          <span>{{ absence.startDate | date }}</span>
        </div>
        <div class="date">
          <span class="label">Fin:</span>
          <span>{{ absence.endDate | date }}</span>
        </div>
      </div>

      <div class="status-badge">{{ getStatusLabel(absence.status) }}</div>
      
      <p *ngIf="absence.reason" class="reason">{{ absence.reason }}</p>
    </div>
  `,
  styles: [`
    .absence-item {
      background: white;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .absence-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .member-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
      padding: 0.5rem;
      background: #f8f9fa;
      border-radius: 4px;
    }

    .member-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }

    .member-name {
      font-weight: 500;
      color: #2c3e50;
    }

    .type-badge {
      background: #e3f2fd;
      color: #2196f3;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.875rem;
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

    .absence-dates {
      margin-bottom: 1rem;
    }

    .date {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
    }

    .label {
      color: #666;
      font-weight: 500;
    }

    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }

    .reason {
      color: #666;
      font-size: 0.875rem;
      font-style: italic;
    }

    /* Status styles */
    .pending .status-badge {
      background: #fff3e0;
      color: #f57c00;
    }

    .approved .status-badge {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .rejected .status-badge {
      background: #ffebee;
      color: #c62828;
    }
  `]
})
export class AbsenceItemComponent {
  @Input() absence!: Absence;
  @Output() edit = new EventEmitter<Absence>();
  @Output() delete = new EventEmitter<Absence>();

  constructor(public memberService: MemberService) {}

  getAbsenceType(type: string): string {
    const types: Record<string, string> = {
      vacation: 'Congés',
      sick: 'Maladie',
      remote: 'Télétravail',
      other: 'Autre'
    };
    return types[type] || type;
  }

  getStatusLabel(status: string): string {
    const statuses: Record<string, string> = {
      pending: 'En attente',
      approved: 'Approuvé',
      rejected: 'Refusé'
    };
    return statuses[status] || status;
  }

  onEdit(): void {
    this.edit.emit(this.absence);
  }

  onDelete(): void {
    this.delete.emit(this.absence);
  }
}