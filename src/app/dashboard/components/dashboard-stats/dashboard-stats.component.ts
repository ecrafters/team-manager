import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DashboardStat {
  icon: string;
  value: number;
  label: string;
  color?: string;
}

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-grid">
      <div *ngFor="let stat of stats" class="stat-card" [style.border-left-color]="stat.color">
        <i [class]="'fas ' + stat.icon" [style.color]="stat.color"></i>
        <div class="stat-content">
          <span class="stat-value" [style.color]="stat.color">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 1.5rem;
      border-left: 4px solid transparent;
      transition: transform 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
    }

    .stat-card i {
      font-size: 2rem;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: bold;
      line-height: 1;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: #666;
      font-size: 0.875rem;
    }
  `]
})
export class DashboardStatsComponent {
  @Input() stats: DashboardStat[] = [];
}