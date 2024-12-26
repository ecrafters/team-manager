import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Project } from '../../models/project.model';
import { TeamService } from '../../../team/services/team.service';
import { TeamMember } from '../../../team/models/team-member.model';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="projectForm" (ngSubmit)="onSubmit()" class="project-form">
      <h3>{{ editMode ? 'Modifier' : 'Ajouter' }} un projet</h3>
      
      <div class="form-group">
        <label for="name">Nom du projet *</label>
        <input type="text" id="name" formControlName="name" class="form-control">
      </div>

      <div class="form-group">
        <label for="description">Description *</label>
        <textarea id="description" formControlName="description" rows="3" class="form-control"></textarea>
      </div>

      <div class="form-group">
        <label for="status">Statut *</label>
        <select id="status" formControlName="status" class="form-control">
          <option value="active">Actif</option>
          <option value="completed">Terminé</option>
          <option value="on-hold">En pause</option>
        </select>
      </div>

      <div class="form-group">
        <label for="progress">Progression (%) *</label>
        <input type="number" id="progress" formControlName="progress" min="0" max="100" class="form-control">
      </div>

      <div class="form-group">
        <label for="startDate">Date de début</label>
        <input type="date" id="startDate" formControlName="startDate" class="form-control">
      </div>

      <div class="form-group">
        <label for="endDate">Date de fin</label>
        <input type="date" id="endDate" formControlName="endDate" class="form-control">
      </div>

      <div class="form-group">
        <label>Membres de l'équipe</label>
        <div class="team-members-list">
          <div *ngFor="let member of teamMembers" class="team-member-item">
            <label>
              <input type="checkbox" 
                     [value]="member.id"
                     (change)="onTeamMemberChange($event, member.id!)"
                     [checked]="isTeamMemberSelected(member.id!)">
              {{ member.firstName }} {{ member.lastName }}
            </label>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn-cancel" (click)="onCancel()">Annuler</button>
        <button type="submit" [disabled]="!projectForm.valid">
          {{ editMode ? 'Modifier' : 'Ajouter' }}
        </button>
      </div>
    </form>
  `,
  styles: [/* ... existing styles ... */]
})
export class ProjectFormComponent implements OnInit {
  @Input() editMode = false;
  @Input() project: Project | undefined;
  @Output() submitProject = new EventEmitter<Partial<Project>>();
  @Output() cancel = new EventEmitter<void>();

  projectForm: FormGroup;
  teamMembers: TeamMember[] = [];
  selectedTeamMembers: string[] = [];

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService
  ) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      status: ['active', Validators.required],
      progress: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadTeamMembers();
    if (this.editMode && this.project) {
      this.projectForm.patchValue(this.project);
      this.selectedTeamMembers = [...this.project.teamMembers];
    }
  }

  private loadTeamMembers(): void {
    this.teamService.getTeamMembers().subscribe({
      next: (members) => this.teamMembers = members,
      error: (error) => console.error('Error loading team members:', error)
    });
  }

  onTeamMemberChange(event: Event, memberId: string): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedTeamMembers.push(memberId);
    } else {
      this.selectedTeamMembers = this.selectedTeamMembers.filter(id => id !== memberId);
    }
  }

  isTeamMemberSelected(memberId: string): boolean {
    return this.selectedTeamMembers.includes(memberId);
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const formData = {
        ...this.projectForm.value,
        teamMembers: this.selectedTeamMembers
      };
      this.submitProject.emit(formData);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}