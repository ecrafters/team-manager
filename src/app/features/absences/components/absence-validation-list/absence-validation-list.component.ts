import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Absence } from '../../models/absence.model';
import { AbsenceValidationService } from '../../services/absence-validation.service';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-absence-validation-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="validation-list">
      <div class="list-header">
        <h3>Demandes en attente</h3>
      </div>

      <div class="list-content">
        <div *ngFor="let absence of pendingAbsences" class="absence-item">
          <div class="absence-header">
            <div class="member-info">
              <img [src]="getMemberAvatar(absence.userId)" [alt]="getMemberName(absence.userId)" class="member-avatar">
              <span class="member-name">{{ getMemberName(absence.userId) }}</span>
            </div>
            <span class="type-badge" [class]="absence.type">
              {{ getAbsenceType(absence.type) }}
            </span>
          </div>

          <div class="absence-details">
            <div class="date-range">
              <i class="fas fa-calendar"></i>
              {{ formatDateRange(absence.startDate, absence.endDate) }}
            </div>
            <p *ngIf="absence.reason" class="reason">
              <i class="fas fa-comment"></i>
              {{ absence.reason }}
            </p>
          </div>

          <div class="action-buttons">
            <button class="btn-approve" (click)="approveAbsence(absence)">
              <i class="fas fa-check"></i>
              Approuver
            </button>
            <button class="btn-reject" (click)="rejectAbsence(absence)">
              <i class="fas fa-times"></i>
              Rejeter
            </button>
          </div>
        </div>

        <div *ngIf="pendingAbsences.length === 0" class="empty-state">
          <i class="fas fa-check-circle"></i>
          <p>Aucune demande en attente</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .validation-list {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .list-header {
      padding: 1.5rem;
      border-bottom: 1px solid #eee;
    }

    .list-content {
      padding: 1rem;
    }

    .absence-item {
      padding: 1rem;
      border: 1px solid #eee;
      border-radius: 6px;
      margin-bottom: 1rem;
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
    }

    .member-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .member-name {
      font-weight: 500;
    }

    .type-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.875rem;
    }

    .type-badge.vacation {
      background: #e8f5e9;
      color: #27ae60;
    }

    .type-badge.sick {
      background: #ffebee;
      color: #e74c3c;
    }

    .type-badge.remote {
      background: #e3f2fd;
      color: #3498db;
    }

    .absence-details {
      margin-bottom: 1rem;
    }

    .date-range {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
      margin-bottom: 0.5rem;
    }

    .reason {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      color: #666;
      font-style: italic;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
    }

    button {
      flex: 1;
      padding: 0.75rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .btn-approve {
      background: #27ae60;
      color: white;
    }

    .btn-approve:hover {
      background: #219a52;
    }

    .btn-reject {
      background: #e74c3c;
      color: white;
    }

    .btn-reject:hover {
      background: #c0392b;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #666;
    }

    .empty-state i {
      font-size: 3rem;
      color: #27ae60;
      margin-bottom: 1rem;
    }
  `]
})
export class AbsenceValidationListComponent implements OnInit {
  pendingAbsences: Absence[] = [];

  constructor(
    private validationService: AbsenceValidationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadPendingAbsences();
  }

  private loadPendingAbsences(): void {
    this.validationService.getPendingAbsences().subscribe({
      next: (absences) => this.pendingAbsences = absences,
      error: (error) => console.error('Error loading pending absences:', error)
    });
  }

  getMemberName(userId: string): string {
    // Implement member name retrieval
    return 'John Doe';
  }

  getMemberAvatar(userId: string): string {
    // Implement member avatar retrieval
    return 'assets/default-avatar.png';
  }

  getAbsenceType(type: string): string {
    const types: Record<string, string> = {
      vacation: 'Congés',
      sick: 'Maladie',
      remote: 'Télétravail',
      other: 'Autre'
    };
    return types[type] || type;
  }

  formatDateRange(start: Date, end: Date): string {
    return `Du ${new Date(start).toLocaleDateString()} au ${new Date(end).toLocaleDateString()}`;
  }

  approveAbsence(absence: Absence): void {
    this.validationService.approveAbsence(absence.id!).subscribe({
      next: () => this.loadPendingAbsences(),
      error: (error) => console.error('Error approving absence:', error)
    });
  }

  rejectAbsence(absence: Absence): void {
    // Show rejection dialog with comment requirement
    const comment = prompt('Motif du rejet :');
    if (comment) {
      this.validationService.rejectAbsence(absence.id!, comment).subscribe({
        next: () => this.loadPendingAbsences(),
        error: (error) => console.error('Error rejecting absence:', error)
      });
    }
  }
}