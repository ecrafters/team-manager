import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TeamMember } from '../../../team/models/team-member.model';
import { Project } from '../../../projects/models/project.model';

export interface WorkloadFilters {
  memberId?: string;
  projectId?: string;
  startDate?: string;
  endDate?: string;
}

@Component({
  selector: 'app-workload-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="filters-container">
      <form [formGroup]="filterForm" class="filters-form">
        <div class="filter-group">
          <label for="memberId">Membre</label>
          <select id="memberId" formControlName="memberId" class="filter-control">
            <option value="">Tous les membres</option>
            <option *ngFor="let member of members" [value]="member.id">
              {{ member.firstName }} {{ member.lastName }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label for="projectId">Projet</label>
          <select id="projectId" formControlName="projectId" class="filter-control">
            <option value="">Tous les projets</option>
            <option *ngFor="let project of projects" [value]="project.id">
              {{ project.name }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label for="startDate">Date de début</label>
          <input type="date" 
                 id="startDate" 
                 formControlName="startDate" 
                 class="filter-control">
        </div>

        <div class="filter-group">
          <label for="endDate">Date de fin</label>
          <input type="date" 
                 id="endDate" 
                 formControlName="endDate" 
                 class="filter-control">
        </div>

        <button type="button" class="btn-reset" (click)="resetFilters()">
          <i class="fas fa-undo"></i> Réinitialiser
        </button>
      </form>
    </div>
  `,
  styles: [`
    .filters-container {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 1rem;
    }

    .filters-form {
      display: flex;
      gap: 1rem;
      align-items: flex-end;
      flex-wrap: wrap;
    }

    .filter-group {
      flex: 1;
      min-width: 200px;
    }

    .filter-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #666;
      font-size: 0.875rem;
    }

    .filter-control {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .btn-reset {
      background: #e0e0e0;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
    }

    .btn-reset:hover {
      background: #d5d5d5;
    }
  `]
})
export class WorkloadFiltersComponent {
  @Input() members: TeamMember[] = [];
  @Input() projects: Project[] = [];
  @Output() filtersChange = new EventEmitter<WorkloadFilters>();

  filterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      memberId: [''],
      projectId: [''],
      startDate: [''],
      endDate: ['']
    });

    this.filterForm.valueChanges.subscribe(filters => {
      this.filtersChange.emit(filters);
    });
  }

  resetFilters(): void {
    this.filterForm.reset();
  }
}