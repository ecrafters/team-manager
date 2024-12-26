import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

export interface ProjectFilters {
  name?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

@Component({
  selector: 'app-project-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="filters-container">
      <form [formGroup]="filterForm" class="filters-form">
        <div class="filter-group">
          <label for="name">Nom du projet</label>
          <input type="text" 
                 id="name" 
                 formControlName="name" 
                 class="filter-control"
                 placeholder="Rechercher un projet...">
        </div>

        <div class="filter-group">
          <label for="status">Statut</label>
          <select id="status" formControlName="status" class="filter-control">
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="completed">Terminé</option>
            <option value="on-hold">En pause</option>
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
export class ProjectFiltersComponent {
  @Output() filtersChange = new EventEmitter<ProjectFilters>();

  filterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      name: [''],
      status: [''],
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