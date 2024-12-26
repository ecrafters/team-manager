import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Absence } from '../../models/absence.model';

@Component({
  selector: 'app-absence-validation-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="validation-table">
      <table>
        <thead>
          <tr>
            <th>Membre</th>
            <th>Type</th>
            <th>Dates</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let absence of pendingAbsences">
            <td>{{ getMemberName(absence.userId) }}</td>
            <td>
              <span class="type-badge" [class]="absence.type">
                {{ getAbsenceType(absence.type) }}
              </span>
            </td>
            <td>{{ formatDateRange(absence.startDate, absence.endDate) }}</td>
            <td>
              <span class="status-badge pending">En attente</span>
            </td>
            <td class="actions">
              <button class="btn-approve" (click)="onApprove.emit(absence)">
                <i class="fas fa-check"></i> Approuver
              </button>
              <button class="btn-reject" (click)="onReject.emit(absence)">
                <i class="fas fa-times"></i> Rejeter
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .validation-table {
      background: white;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    .type-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
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

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .status-badge.pending {
      background: #fff3e0;
      color: #f57c00;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
    }

    .btn-approve {
      background: #27ae60;
      color: white;
    }

    .btn-reject {
      background: #e74c3c;
      color: white;
    }
  `]
})
export class AbsenceValidationTableComponent {
  @Input() absences: Absence[] = [];
  @Output() onApprove = new EventEmitter<Absence>();
  @Output() onReject = new EventEmitter<Absence>();

  get pendingAbsences(): Absence[] {
    return this.absences.filter(absence => absence.status === 'pending');
  }

  getMemberName(userId: string): string {
    // Implémenter la récupération du nom du membre
    return 'Nom du membre';
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
}