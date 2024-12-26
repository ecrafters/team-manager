import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../models/project.model';
import { ProjectFiltersComponent, ProjectFilters } from '../project-filters/project-filters.component';
import { ProjectFilterService } from '../../services/project-filter.service';
import { ItemCardComponent } from '../../../../shared/components/item-card/item-card.component';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, ProjectFiltersComponent, ItemCardComponent],
  template: `
    <div class="project-list">
      <app-project-filters
        (filtersChange)="onFiltersChange($event)"
      ></app-project-filters>

      <div class="projects-grid">
        <app-item-card
          *ngFor="let project of filteredProjects"
          [title]="project.name"
          [badge]="getStatusLabel(project.status)"
          [status]="project.status"
          [footerContent]="getDateRange(project)"
          (onEdit)="onEdit.emit(project)"
          (onDelete)="onDelete.emit(project)"
        >
          <div class="project-content">
            <p class="description">{{ project.description }}</p>
            <div class="progress-section">
              <div class="progress-bar">
                <div class="progress" [style.width.%]="project.progress"></div>
              </div>
              <span class="progress-text">{{ project.progress }}%</span>
            </div>
          </div>
        </app-item-card>
      </div>
    </div>
  `,
  styles: [`
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
    }

    .project-content {
      padding: 0.5rem 0;
    }

    .description {
      color: #666;
      margin-bottom: 1rem;
    }

    .progress-section {
      margin-bottom: 0.5rem;
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
      background: #3498db;
      border-radius: 4px;
    }

    .progress-text {
      font-size: 0.875rem;
      color: #666;
    }
  `]
})
export class ProjectListComponent {
  @Input() projects: Project[] = [];
  @Output() onEdit = new EventEmitter<Project>();
  @Output() onDelete = new EventEmitter<Project>();

  filteredProjects: Project[] = [];

  constructor(private filterService: ProjectFilterService) {}

  ngOnInit(): void {
    this.filteredProjects = this.projects;
  }

  ngOnChanges(): void {
    this.filteredProjects = this.projects;
  }

  onFiltersChange(filters: ProjectFilters): void {
    this.filteredProjects = this.filterService.filterProjects(this.projects, filters);
  }

  getStatusLabel(status: string): string {
    const statuses: Record<string, string> = {
      active: 'Actif',
      completed: 'Terminé',
      'on-hold': 'En pause'
    };
    return statuses[status] || status;
  }

  getDateRange(project: Project): string {
    const start = new Date(project.startDate).toLocaleDateString();
    const end = new Date(project.endDate).toLocaleDateString();
    return `Du ${start} au ${end}`;
  }
}