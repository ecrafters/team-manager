import { Injectable } from '@angular/core';
import { DashboardViewModel } from '../models/dashboard-view.model';
import { DashboardData } from '../models/dashboard.model';
import { DashboardFilters } from '../components/dashboard-filters/dashboard-filters.component';

@Injectable({
  providedIn: 'root'
})
export class DashboardStateService {
  private currentFilters: DashboardFilters | null = null;

  getInitialState(): DashboardViewModel {
    return {
      stats: [],
      memberWorkloads: [],
      projectStats: {
        active: 0,
        completed: 0,
        onHold: 0,
        delayed: 0
      },
      teamStats: {
        activeMembers: 0,
        overloaded: 0,
        optimal: 0,
        underloaded: 0
      },
      absenceStats: {
        pending: 0,
        approved: 0,
        rejected: 0,
        byType: {
          vacation: 0,
          sick: 0,
          remote: 0,
          other: 0
        }
      }
    };
  }

  updateFilters(filters: DashboardFilters): void {
    this.currentFilters = filters;
  }

  getCurrentFilters(): DashboardFilters | null {
    return this.currentFilters;
  }

  updateState(data: DashboardData): DashboardViewModel {
    return {
      stats: this.mapToStats(data),
      memberWorkloads: this.mapToMemberWorkloads(data),
      projectStats: data.projectStats,
      teamStats: data.teamStats,
      absenceStats: data.absenceStats
    };
  }

  private mapToStats(data: DashboardData): DashboardViewModel['stats'] {
    return [
      {
        icon: 'fa-users',
        value: data.teamStats.activeMembers,
        label: 'Membres actifs',
        color: '#3498db'
      },
      {
        icon: 'fa-project-diagram',
        value: data.projectStats.active,
        label: 'Projets en cours',
        color: '#27ae60'
      },
      {
        icon: 'fa-calendar-alt',
        value: data.absenceStats.pending,
        label: 'Absences à valider',
        color: '#f39c12'
      },
      {
        icon: 'fa-exclamation-triangle',
        value: data.projectStats.delayed,
        label: 'Projets en retard',
        color: '#e74c3c'
      }
    ];
  }

  private mapToMemberWorkloads(data: DashboardData): DashboardViewModel['memberWorkloads'] {
    return data.teamStats.members.map(member => ({
      id: member.id!,
      name: `${member.firstName} ${member.lastName}`,
      avatar: member.avatar || 'assets/default-avatar.png',
      workload: member.workload,
      projects: member.projectCount
    }));
  }
}