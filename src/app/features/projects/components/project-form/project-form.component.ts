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
  styles: [`
  .project-form {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-in-out;
}

.project-form h3 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #333;
  font-weight: 600;
  position: relative;
}

.project-form h3::after {
  content: '';
  display: block;
  width: 80px;
  height: 3px;
  background: #3498db;
  margin-top: 0.5rem;
  animation: slideIn 0.6s ease-in-out;
}

.form-group {
  margin-bottom: 1.5rem;
  opacity: 0;
  animation: fadeInUp 0.6s ease-in-out forwards;
  animation-delay: calc(var(--form-index, 1) * 0.1s);
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #555;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-control:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 6px rgba(52, 152, 219, 0.5);
}

textarea.form-control {
  resize: none;
}

.team-members-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.team-member-item {
  flex: 1 1 calc(50% - 1rem);
  transform: translateY(10px);
  animation: fadeInUp 0.6s ease-in-out forwards;
  animation-delay: calc(var(--form-index, 1) * 0.1s);
}

.team-member-item label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

input[type="checkbox"] {
  width: 18px;
  height: 18px;
  margin: 0;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

input[type="checkbox"]:checked {
  transform: scale(1.2);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  opacity: 0;
  animation: fadeIn 0.5s ease-in-out forwards;
  animation-delay: 1.2s;
}

.btn-cancel {
  background: #e74c3c;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease-in-out;
}

.btn-cancel:hover {
  background: #c0392b;
  transform: translateY(-2px);
}

button[type="submit"] {
  background: #3498db;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease-in-out;
}

button[type="submit"]:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

button[disabled] {
  background: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .project-form {
    padding: 1rem;
  }

  .form-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .btn-cancel,
  button[type="submit"] {
    width: 100%;
  }

  .team-member-item {
    flex: 1 1 100%;
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    width: 0;
  }
  to {
    width: 80px;
  }
}

  `]
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