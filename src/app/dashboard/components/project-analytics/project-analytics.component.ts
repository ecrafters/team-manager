import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ProjectStats {
  active: number;
  completed: number;
  onHold: number;
  delayed: number;
}

@Component({
  selector: 'app-project-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="analytics-card">
      <h3>Analyse des Projets</h3>
      
      <div class="metrics-grid">
        <div class="metric">
          <span class="label">Projets en retard</span>
          <span class="value danger">{{ stats?.delayed || 0 }}</span>
        </div>
        <div class="metric">
          <span class="label">En pause</span>
          <span class="value warning">{{ stats?.onHold || 0 }}</span>
        </div>
        <div class="metric">
          <span class="label">En cours</span>
          <span class="value success">{{ stats?.active || 0 }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin: 1rem 0;
    }

    .metric {
      text-align: center;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 4px;
    }

    .metric .label {
      display: block;
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 0.5rem;
    }

    .metric .value {
      font-size: 1.25rem;
      font-weight: bold;
    }

    .value.danger { color: #e74c3c; }
    .value.warning { color: #f39c12; }
    .value.success { color: #27ae60; }
  `]
})
export class ProjectAnalyticsComponent {
  @Input() stats: ProjectStats | undefined;
}