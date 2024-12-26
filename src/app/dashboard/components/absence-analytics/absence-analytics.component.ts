import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AbsenceTypeStats {
  vacation: number;
  sick: number;
  remote: number;
  other: number;
}

interface AbsenceStats {
  pending: number;
  approved: number;
  rejected: number;
  byType: AbsenceTypeStats;
}

@Component({
  selector: 'app-absence-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="analytics-card">
      <h3>Analyse des Absences</h3>
      
      <div class="metrics-grid">
        <div class="metric">
          <span class="label">En attente</span>
          <span class="value warning">{{ stats?.pending || 0 }}</span>
        </div>
        <div class="metric">
          <span class="label">Approuvées</span>
          <span class="value success">{{ stats?.approved || 0 }}</span>
        </div>
        <div class="metric">
          <span class="label">Refusées</span>
          <span class="value danger">{{ stats?.rejected || 0 }}</span>
        </div>
      </div>

      <div class="absence-section">
        <h4>Répartition par type</h4>
        <div class="absence-list">
          <div class="absence-type">
            <div class="type-info">
              <span>Congés payés</span>
              <span>{{ getTypeCount('vacation') }} demandes</span>
            </div>
            <div class="type-bar">
              <div class="type-indicator vacation" 
                   [style.width.%]="getTypePercentage('vacation')">
              </div>
            </div>
          </div>
          <div class="absence-type">
            <div class="type-info">
              <span>Télétravail</span>
              <span>{{ getTypeCount('remote') }} demandes</span>
            </div>
            <div class="type-bar">
              <div class="type-indicator remote" 
                   [style.width.%]="getTypePercentage('remote')">
              </div>
            </div>
          </div>
          <div class="absence-type">
            <div class="type-info">
              <span>Maladie</span>
              <span>{{ getTypeCount('sick') }} demandes</span>
            </div>
            <div class="type-bar">
              <div class="type-indicator sick" 
                   [style.width.%]="getTypePercentage('sick')">
              </div>
            </div>
          </div>
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

    .absence-section {
      margin-top: 1.5rem;
    }

    .absence-list {
      margin-top: 1rem;
    }

    .absence-type {
      margin-bottom: 1rem;
    }

    .type-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .type-bar {
      height: 8px;
      background: #f5f5f5;
      border-radius: 4px;
      overflow: hidden;
    }

    .type-indicator {
      height: 100%;
      border-radius: 4px;
    }

    .type-indicator.vacation { background: #27ae60; }
    .type-indicator.remote { background: #3498db; }
    .type-indicator.sick { background: #e74c3c; }
  `]
})
export class AbsenceAnalyticsComponent {
  @Input() stats: AbsenceStats | undefined;

  getTypeCount(type: keyof AbsenceTypeStats): number {
    return this.stats?.byType?.[type] || 0;
  }

  getTypePercentage(type: keyof AbsenceTypeStats): number {
    if (!this.stats?.byType) return 0;
    
    const total = Object.values(this.stats.byType).reduce((sum, count) => sum + count, 0);
    if (total === 0) return 0;
    
    return (this.stats.byType[type] / total) * 100;
  }
}