import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Workload } from '../../../../core/models/firestore/workload.model';
import { WorkloadMemberService } from '../../services/workload-member.service';

@Component({
  selector: 'app-workload-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="workload-item">
      <div class="workload-header">
        <div class="member-info">
          <img [src]="memberService.getMemberAvatar(workload.userId)" 
               [alt]="memberService.getMemberName(workload.userId)"
               class="member-avatar">
          <div class="info-text">
            <span class="member-name">{{ memberService.getMemberName(workload.userId) }}</span>
            <span class="project-name">{{ memberService.getProjectName(workload.projectId) }}</span>
          </div>
        </div>
        <div class="actions">
          <button class="btn-icon" (click)="onEdit()">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-icon" (click)="onDelete()">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>

      <div class="allocation-info">
        <div class="progress-bar" [class.overload]="workload.allocation > 100">
          <div class="progress" [style.width.%]="workload.allocation"></div>
        </div>
        <span class="allocation-text" [class.overload]="workload.allocation > 100">
          {{ workload.allocation }}%
        </span>
      </div>

      <div class="workload-dates">
        <div class="date">
          <span class="label">Début:</span>
          <span>{{ workload.startDate | date }}</span>
        </div>
        <div class="date">
          <span class="label">Fin:</span>
          <span>{{ workload.endDate | date }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .workload-item {
      background: white;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .workload-header {
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

    .info-text {
      display: flex;
      flex-direction: column;
    }

    .member-name {
      font-weight: 500;
      color: #2c3e50;
    }

    .project-name {
      font-size: 0.875rem;
      color: #666;
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

    .allocation-info {
      margin-bottom: 1rem;
    }

    .progress-bar {
      height: 8px;
      background: #f5f5f5;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 0.25rem;
    }

    .progress {
      height: 100%;
      background: #2ecc71;
      border-radius: 4px;
    }

    .progress-bar.overload .progress {
      background: #e74c3c;
    }

    .allocation-text {
      font-size: 0.875rem;
      color: #2ecc71;
    }

    .allocation-text.overload {
      color: #e74c3c;
    }

    .workload-dates {
      font-size: 0.875rem;
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
  `]
})
export class WorkloadItemComponent {
  @Input() workload!: Workload;
  @Output() edit = new EventEmitter<Workload>();
  @Output() delete = new EventEmitter<Workload>();

  constructor(public memberService: WorkloadMemberService) {}

  onEdit(): void {
    this.edit.emit(this.workload);
  }

  onDelete(): void {
    this.delete.emit(this.workload);
  }
}