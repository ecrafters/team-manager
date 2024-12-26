import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Workload } from '../../../../core/models/firestore/workload.model';

@Component({
  selector: 'app-workload-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="workload-calendar">
      <div class="calendar-header">
        <h3>Calendrier de charge</h3>
      </div>
      <div class="calendar-grid">
        <div *ngFor="let workload of workloads" class="workload-item">
          <div class="workload-bar" [style.width.%]="workload.allocation">
            {{ workload.allocation }}%
          </div>
          <div class="workload-dates">
            {{ workload.startDate | date:'shortDate' }} - {{ workload.endDate | date:'shortDate' }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .workload-calendar {
      background: white;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .calendar-header {
      margin-bottom: 1rem;
    }
    .workload-item {
      margin-bottom: 1rem;
      padding: 0.5rem;
      background: #f8f9fa;
      border-radius: 4px;
    }
    .workload-bar {
      height: 24px;
      background: #3498db;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      margin-bottom: 0.5rem;
    }
    .workload-dates {
      font-size: 0.875rem;
      color: #666;
    }
  `]
})
export class WorkloadCalendarComponent {
  @Input() workloads: Workload[] = [];
}