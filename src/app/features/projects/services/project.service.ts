import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Project } from '../models/project.model';
import { ProjectsService } from '../../../core/services/firebase/collections/projects.service';
import { FirebaseAuthService } from '../../../core/services/auth/firebase-auth.service';
import { switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(
    private projectsService: ProjectsService,
    private authService: FirebaseAuthService
  ) {}

  getProjects(): Observable<Project[]> {
    return this.projectsService.getProjects();
  }

  addProject(projectData: Partial<Project>): Observable<string> {
    return this.authService.isAuthenticated().pipe(
      take(1),
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          return throwError(() => new Error('Authentication required'));
        }

        const newProject = {
          name: projectData.name || '',
          description: projectData.description || '',
          status: projectData.status || 'active',
          progress: projectData.progress || 0,
          startDate: projectData.startDate ? new Date(projectData.startDate) : new Date(),
          endDate: projectData.endDate ? new Date(projectData.endDate) : new Date(),
          teamMembers: projectData.teamMembers || [],
          createdBy: 'system', // Will be updated with actual user ID when auth is implemented
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        return this.projectsService.addProject(newProject);
      })
    );
  }

  updateProject(id: string, projectData: Partial<Project>): Observable<void> {
    return this.authService.isAuthenticated().pipe(
      take(1),
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          return throwError(() => new Error('Authentication required'));
        }

        const updateData = {
          ...projectData,
          updatedAt: new Date()
        };

        if (projectData.startDate) {
          updateData.startDate = new Date(projectData.startDate);
        }
        if (projectData.endDate) {
          updateData.endDate = new Date(projectData.endDate);
        }

        return this.projectsService.updateProject(id, updateData);
      })
    );
  }

  deleteProject(id: string): Observable<void> {
    return this.authService.isAuthenticated().pipe(
      take(1),
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          return throwError(() => new Error('Authentication required'));
        }
        return this.projectsService.deleteProject(id);
      })
    );
  }
}