import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MemberWorkload {
  id: string;
  name: string;
  avatar: string;
  workload: number;
  projects: number;
}

@Component({
  selector: 'app-member-workload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="member-workload-container">
      <h3>Répartition par membre</h3>
      
      <div class="member-list">
        <div *ngFor="let member of members" class="member-item">
          <div class="member-info">
            <img [src]="member.avatar" [alt]="member.name" class="member-avatar">
            <div class="member-details">
              <span class="member-name">{{ member.name }}</span>
              <span class="project-count">{{ member.projects }} projet(s)</span>
            </div>
          </div>
          
          <div class="workload-info">
            <div class="workload-bar">
              <div class="workload-progress" 
                   [style.width.%]="member.workload"
                   [class.overload]="member.workload > 100"
                   [class.warning]="member.workload >= 80 && member.workload <= 100"
                   [class.optimal]="member.workload >= 50 && member.workload < 80"
                   [class.low]="member.workload < 50">
              </div>
            </div>
            <span class="workload-value" 
                  [class.overload]="member.workload > 100"
                  [class.warning]="member.workload >= 80 && member.workload <= 100"
                  [class.optimal]="member.workload >= 50 && member.workload < 80"
                  [class.low]="member.workload < 50">
              {{ member.workload }}%
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .member-workload-container {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h3 {
      margin-bottom: 1.5rem;
      color: #2c3e50;
    }

    .member-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .member-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
      transition: transform 0.3s ease;
    }

    .member-item:hover {
      transform: translateX(4px);
    }

    .member-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .member-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .member-details {
      display: flex;
      flex-direction: column;
    }

    .member-name {
      font-weight: 500;
      color: #2c3e50;
    }

    .project-count {
      font-size: 0.875rem;
      color: #666;
    }

    .workload-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      min-width: 200px;
    }

    .workload-bar {
      flex: 1;
      height: 8px;
      background: #eee;
      border-radius: 4px;
      overflow: hidden;
    }

    .workload-progress {
      height: 100%;
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .workload-progress.overload { background: #e74c3c; }
    .workload-progress.warning { background: #f39c12; }
    .workload-progress.optimal { background: #27ae60; }
    .workload-progress.low { background: #3498db; }

    .workload-value {
      font-weight: 500;
      min-width: 48px;
      text-align: right;
    }

    .workload-value.overload { color: #e74c3c; }
    .workload-value.warning { color: #f39c12; }
    .workload-value.optimal { color: #27ae60; }
    .workload-value.low { color: #3498db; }
  `]
})
export class MemberWorkloadComponent {
  @Input() members: MemberWorkload[] = [];
}