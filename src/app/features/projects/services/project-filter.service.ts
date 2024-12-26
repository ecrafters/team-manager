import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';
import { ProjectFilters } from '../components/project-filters/project-filters.component';

@Injectable({
  providedIn: 'root'
})
export class ProjectFilterService {
  filterProjects(projects: Project[], filters: ProjectFilters): Project[] {
    return projects.filter(project => {
      // Filter by name
      if (filters.name && !project.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }

      // Filter by status
      if (filters.status && project.status !== filters.status) {
        return false;
      }

      // Filter by date range
      if (filters.startDate) {
        const filterStart = new Date(filters.startDate);
        const projectStart = new Date(project.startDate);
        if (projectStart < filterStart) {
          return false;
        }
      }

      if (filters.endDate) {
        const filterEnd = new Date(filters.endDate);
        const projectEnd = new Date(project.endDate);
        if (projectEnd > filterEnd) {
          return false;
        }
      }

      return true;
    });
  }
}