import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Workload } from '../../../../core/models/firestore/workload.model';
import { TeamService } from '../../../team/services/team.service';
import { ProjectService } from '../../../projects/services/project.service';
import { TeamMember } from '../../../team/models/team-member.model';
import { Project } from '../../../projects/models/project.model';

@Component({
  selector: 'app-workload-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="workload-form">
      <h3>{{ editMode ? 'Modifier' : 'Ajouter' }} une charge</h3>
      <form [formGroup]="workloadForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="userId">Membre *</label>
          <select id="userId" formControlName="userId" class="form-control">
            <option value="">Sélectionner un membre</option>
            <option *ngFor="let member of teamMembers" [value]="member.id">
              {{ member.firstName }} {{ member.lastName }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="projectId">Projet *</label>
          <select id="projectId" formControlName="projectId" class="form-control">
            <option value="">Sélectionner un projet</option>
            <option *ngFor="let project of projects" [value]="project.id">
              {{ project.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="allocation">Allocation (%) *</label>
          <input type="number" 
                 id="allocation" 
                 formControlName="allocation" 
                 class="form-control" 
                 min="0" 
                 max="100">
        </div>

        <div class="form-group">
          <label for="startDate">Date de début *</label>
          <input type="date" 
                 id="startDate" 
                 formControlName="startDate" 
                 class="form-control">
        </div>

        <div class="form-group">
          <label for="endDate">Date de fin *</label>
          <input type="date" 
                 id="endDate" 
                 formControlName="endDate" 
                 class="form-control">
        </div>

        <div class="form-actions">
          <button type="button" class="btn-cancel" (click)="onCancel()">Annuler</button>
          <button type="submit" [disabled]="!workloadForm.valid">
            {{ editMode ? 'Modifier' : 'Ajouter' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .workload-form {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-top: 0.25rem;
    }
    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }
    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-cancel {
      background: #e0e0e0;
    }
    button[type="submit"] {
      background: #3498db;
      color: white;
      flex: 1;
    }
    button:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
    }
  `]
})
export class WorkloadFormComponent implements OnInit {
  @Input() editMode = false;
  @Input() workload: Workload | undefined;
  @Output() submitWorkload = new EventEmitter<Partial<Workload>>();
  @Output() cancel = new EventEmitter<void>();

  workloadForm: FormGroup;
  teamMembers: TeamMember[] = [];
  projects: Project[] = [];

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private projectService: ProjectService
  ) {
    this.workloadForm = this.fb.group({
      userId: ['', Validators.required],
      projectId: ['', Validators.required],
      allocation: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTeamMembers();
    this.loadProjects();

    if (this.editMode && this.workload) {
      this.workloadForm.patchValue({
        userId: this.workload.userId,
        projectId: this.workload.projectId,
        allocation: this.workload.allocation,
        startDate: this.formatDate(this.workload.startDate),
        endDate: this.formatDate(this.workload.endDate)
      });
    }
  }

  private loadTeamMembers(): void {
    this.teamService.getTeamMembers().subscribe({
      next: (members) => this.teamMembers = members,
      error: (error) => console.error('Error loading team members:', error)
    });
  }

  private loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (projects) => this.projects = projects,
      error: (error) => console.error('Error loading projects:', error)
    });
  }

  private formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.workloadForm.valid) {
      this.submitWorkload.emit(this.workloadForm.value);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}