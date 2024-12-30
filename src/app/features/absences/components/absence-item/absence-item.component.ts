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
    background: #ffffff;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
  }

  .absence-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  }

  .absence-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .type-badge {
    background: #e3f2fd;
    color: #1976d2;
    padding: 0.5rem 1rem;
    border-radius: 16px;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: capitalize;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .actions {
    display: flex;
    gap: 0.75rem;
  }

  .btn-icon {
    background: #f1f3f5;
    border: none;
    border-radius: 50%;
    color: #555;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.3s, color 0.3s;
  }

  .btn-icon:hover {
    background: #e2e6ea;
    color: #000;
  }

  .member-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    padding: 0.75rem 1rem;
    background: #f9fafb;
    border-radius: 8px;
  }

  .member-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #ddd;
  }

  .member-name {
    font-weight: 600;
    font-size: 1rem;
    color: #333;
  }

  .absence-dates {
    margin-bottom: 1rem;
    font-size: 0.875rem;
    color: #666;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .status-badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 16px;
    font-size: 0.875rem;
    font-weight: 600;
    margin-top: 1rem;
  }

  .pending .status-badge {
    background: #fff3e0;
    color: #ef6c00;
  }

  .approved .status-badge {
    background: #e8f5e9;
    color: #2e7d32;
  }

  .rejected .status-badge {
    background: #ffebee;
    color: #c62828;
  }

  .reason {
    margin-top: 1rem;
    color: #555;
    font-size: 0.875rem;
    font-style: italic;
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