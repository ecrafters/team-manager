import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

export interface TeamFilters {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  department?: string;
  phone?: string;
}

@Component({
  selector: 'app-team-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="filters-container">
      <form [formGroup]="filterForm" class="filters-form">
        <div class="filter-group">
          <label for="firstName">Prénom</label>
          <input type="text" 
                 id="firstName" 
                 formControlName="firstName" 
                 class="filter-control"
                 placeholder="Rechercher par prénom">
        </div>

        <div class="filter-group">
          <label for="lastName">Nom</label>
          <input type="text" 
                 id="lastName" 
                 formControlName="lastName" 
                 class="filter-control"
                 placeholder="Rechercher par nom">
        </div>

        <div class="filter-group">
          <label for="email">Email</label>
          <input type="email" 
                 id="email" 
                 formControlName="email" 
                 class="filter-control"
                 placeholder="Rechercher par email">
        </div>

        <div class="filter-group">
          <label for="role">Rôle</label>
          <select id="role" formControlName="role" class="filter-control">
            <option value="">Tous les rôles</option>
            <option value="admin">Administrateur</option>
            <option value="manager">Manager</option>
            <option value="developer">Développeur</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="department">Département</label>
          <input type="text" 
                 id="department" 
                 formControlName="department" 
                 class="filter-control"
                 placeholder="Rechercher par département">
        </div>

        <div class="filter-group">
          <label for="phone">Téléphone</label>
          <input type="tel" 
                 id="phone" 
                 formControlName="phone" 
                 class="filter-control"
                 placeholder="Rechercher par téléphone">
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
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
      align-items: end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-group label {
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
      height: fit-content;
    }

    .btn-reset:hover {
      background: #d5d5d5;
    }
  `]
})
export class TeamFiltersComponent {
  @Output() filtersChange = new EventEmitter<TeamFilters>();

  filterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      role: [''],
      department: [''],
      phone: ['']
    });

    this.filterForm.valueChanges.subscribe(filters => {
      this.filtersChange.emit(filters);
    });
  }

  resetFilters(): void {
    this.filterForm.reset();
  }
}