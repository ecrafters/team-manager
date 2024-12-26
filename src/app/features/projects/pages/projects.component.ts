import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectFormComponent } from '../components/project-form/project-form.component';
import { ProjectListComponent } from '../components/project-list/project-list.component';
import { ProjectService } from '../services/project.service';
import { Project } from '../models/project.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ProjectFormComponent, ProjectListComponent],
  template: `
    <div class="projects-page">
      <header class="page-header">
        <h1>Projets</h1>
        <button class="btn-add" (click)="showForm = true" *ngIf="!showForm">
          <i class="fas fa-plus"></i> Nouveau projet
        </button>
      </header>
      
      <div class="content-grid">
        <div class="main-content">
          <app-project-list
            [projects]="projects"
            (onEdit)="onEditProject($event)"
            (onDelete)="onDeleteProject($event)"
          ></app-project-list>
        </div>
        
        <aside class="side-content" *ngIf="showForm">
          <app-project-form
            [editMode]="!!selectedProject"
            [project]="selectedProject"
            (submitProject)="onSubmitProject($event)"
            (cancel)="onCancelForm()"
          ></app-project-form>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .projects-page {
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
      grid-template-columns: 1fr auto;
      gap: 2rem;
    }
    .side-content {
      width: 400px;
    }
    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
      .side-content {
        width: 100%;
      }
    }
  `]
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  showForm = false;
  selectedProject: Project | undefined;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  private loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (projects) => this.projects = projects,
      error: (error) => console.error('Error loading projects:', error)
    });
  }

  onSubmitProject(projectData: Partial<Project>): void {
    if (this.selectedProject) {
      this.projectService.updateProject(this.selectedProject.id!, projectData)
        .subscribe({
          next: () => {
            this.resetForm();
            this.loadProjects();
          },
          error: (error) => console.error('Error updating project:', error)
        });
    } else {
      this.projectService.addProject(projectData as Omit<Project, 'id'>)
        .subscribe({
          next: () => {
            this.resetForm();
            this.loadProjects();
          },
          error: (error) => console.error('Error adding project:', error)
        });
    }
  }

  onEditProject(project: Project): void {
    this.selectedProject = project;
    this.showForm = true;
  }

  onDeleteProject(project: Project): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      this.projectService.deleteProject(project.id!)
        .subscribe({
          next: () => this.loadProjects(),
          error: (error) => console.error('Error deleting project:', error)
        });
    }
  }

  onCancelForm(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.showForm = false;
    this.selectedProject = undefined;
  }
}