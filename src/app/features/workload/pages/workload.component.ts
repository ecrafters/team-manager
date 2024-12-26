import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkloadListComponent } from '../components/workload-list/workload-list.component';
import { WorkloadFormComponent } from '../components/workload-form/workload-form.component';
import { WorkloadService } from '../../../core/services/firebase/collections/workload.service';
import { Workload } from '../../../core/models/firestore/workload.model';

@Component({
  selector: 'app-workload',
  standalone: true,
  imports: [CommonModule, WorkloadListComponent, WorkloadFormComponent],
  template: `
    <div class="workload-page">
      <header class="page-header">
        <h1>Charge de travail</h1>
        <button class="btn-add" (click)="showForm = true" *ngIf="!showForm">
          <i class="fas fa-plus"></i> Nouvelle charge
        </button>
      </header>
      
      <div class="content-grid">
        <div class="main-content">
          <app-workload-list
            [workloads]="workloads"
            (onEdit)="onEditWorkload($event)"
            (onDelete)="onDeleteWorkload($event)"
          ></app-workload-list>
        </div>
        <aside class="side-content" *ngIf="showForm">
          <app-workload-form
            [editMode]="!!selectedWorkload"
            [workload]="selectedWorkload"
            (submitWorkload)="onSubmitWorkload($event)"
            (cancel)="onCancelForm()"
          ></app-workload-form>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .workload-page {
      padding: 1.5rem;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .btn-add {
      background: #3498db;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .content-grid {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 2rem;
    }
    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class WorkloadComponent implements OnInit {
  workloads: Workload[] = [];
  showForm = false;
  selectedWorkload: Workload | undefined;

  constructor(private workloadService: WorkloadService) {}

  ngOnInit(): void {
    this.loadWorkloads();
  }

  private loadWorkloads(): void {
    this.workloadService.getWorkloads().subscribe({
      next: (workloads) => this.workloads = workloads,
      error: (error) => console.error('Error loading workloads:', error)
    });
  }

  onSubmitWorkload(workloadData: Partial<Workload>): void {
    if (this.selectedWorkload) {
      this.workloadService.updateWorkload(this.selectedWorkload.id!, workloadData)
        .subscribe(() => {
          this.resetForm();
          this.loadWorkloads();
        });
    } else {
      this.workloadService.createWorkload(workloadData as Omit<Workload, 'id'>)
        .subscribe(() => {
          this.resetForm();
          this.loadWorkloads();
        });
    }
  }

  onEditWorkload(workload: Workload): void {
    this.selectedWorkload = workload;
    this.showForm = true;
  }

  onDeleteWorkload(workload: Workload): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette charge de travail ?')) {
      this.workloadService.deleteWorkload(workload.id!)
        .subscribe(() => this.loadWorkloads());
    }
  }

  onCancelForm(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.showForm = false;
    this.selectedWorkload = undefined;
  }
}