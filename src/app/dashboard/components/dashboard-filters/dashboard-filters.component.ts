
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

export interface DashboardFilters {
  dateRange: {
    start?: Date;
    end?: Date;
  };
  department?: string;
  projectStatus?: string;
  memberWorkload?: 'all' | 'overloaded' | 'optimal' | 'underloaded';
  absenceType?: string;
}

@Component({
  selector: 'app-dashboard-filters',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard-filters.component.html',
  styleUrls: ['./dashboard-filters.component.css']
})
export class DashboardFiltersComponent {
  @Output() filtersChange = new EventEmitter<DashboardFilters>();

  filterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      department: [''],
      projectStatus: [''],
      memberWorkload: ['all'],
      absenceType: ['']
    });

    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  resetFilters(): void {
    this.filterForm.reset({
      memberWorkload: 'all'
    });
  }

  private applyFilters(): void {
    const formValue = this.filterForm.value;
    
    const filters: DashboardFilters = {
      dateRange: {
        start: formValue.startDate ? new Date(formValue.startDate) : undefined,
        end: formValue.endDate ? new Date(formValue.endDate) : undefined
      },
      department: formValue.department,
      projectStatus: formValue.projectStatus,
      memberWorkload: formValue.memberWorkload,
      absenceType: formValue.absenceType
    };

    this.filtersChange.emit(filters);
  }
}
