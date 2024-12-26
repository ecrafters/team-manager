import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Absence } from '../../models/absence.model';

@Component({
  selector: 'app-absence-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="calendar-container">
      <div class="calendar-header">
        <h3>Calendrier des absences</h3>
      </div>
      
      <div class="calendar-grid">
        <div *ngFor="let absence of approvedAbsences" class="absence-event"
             [class]="absence.type">
          <div class="event-header">
            <span class="member-name">{{ getMemberName(absence.userId) }}</span>
            <span class="absence-type">{{ getAbsenceType(absence.type) }}</span>
          </div>
          <div class="event-dates">
            {{ formatDateRange(absence.startDate, absence.endDate) }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calendar-container {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .calendar-grid {
      display: grid;
      gap: 1rem;
      margin-top: 1rem;
    }

    .absence-event {
      padding: 1rem;
      border-radius: 6px;
      border-left: 4px solid;
    }

    .absence-event.vacation {
      background: #e8f5e9;
      border-left-color: #27ae60;
    }

    .absence-event.sick {
      background: #ffebee;
      border-left-color: #e74c3c;
    }

    .absence-event.remote {
      background: #e3f2fd;
      border-left-color: #3498db;
    }

    .event-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .member-name {
      font-weight: 500;
    }

    .absence-type {
      font-size: 0.875rem;
      color: #666;
    }

    .event-dates {
      font-size: 0.875rem;
      color: #666;
    }
  `]
})
export class AbsenceCalendarComponent {
  @Input() absences: Absence[] = [];

  get approvedAbsences(): Absence[] {
    return this.absences.filter(absence => absence.status === 'approved');
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