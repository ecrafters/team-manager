import { Injectable } from '@angular/core';
import { DashboardData } from '../models/dashboard.model';
import { DashboardFilters } from '../components/dashboard-filters/dashboard-filters.component';

@Injectable({
  providedIn: 'root'
})
export class DashboardFilterService {
  applyFilters(data: DashboardData, filters: DashboardFilters): DashboardData {
    if (!filters) return data;

    const filteredData = { ...data };

    // Filter by date range
    if (filters.dateRange.start || filters.dateRange.end) {
      this.applyDateFilters(filteredData, filters.dateRange);
    }

    // Filter by department
    if (filters.department) {
      this.applyDepartmentFilter(filteredData, filters.department);
    }

    // Filter by project status
    if (filters.projectStatus) {
      this.applyProjectStatusFilter(filteredData, filters.projectStatus);
    }

    // Filter by member workload
    if (filters.memberWorkload && filters.memberWorkload !== 'all') {
      this.applyWorkloadFilter(filteredData, filters.memberWorkload);
    }

    // Filter by absence type
    if (filters.absenceType) {
      this.applyAbsenceTypeFilter(filteredData, filters.absenceType);
    }

    return this.updateStats(filteredData);
  }

  private applyDateFilters(data: DashboardData, dateRange: { start?: Date; end?: Date }): void {
    if (dateRange.start) {
      const startDate = new Date(dateRange.start);
      data.absenceStats.absences = data.absenceStats.absences.filter(
        absence => new Date(absence.startDate) >= startDate
      );
    }

    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      data.absenceStats.absences = data.absenceStats.absences.filter(
        absence => new Date(absence.endDate) <= endDate
      );
    }
  }

  private applyDepartmentFilter(data: DashboardData, department: string): void {
    data.teamStats.members = data.teamStats.members.filter(
      member => member.department === department
    );
  }

  private applyProjectStatusFilter(data: DashboardData, status: string): void {
    data.projectStats.projects = data.projectStats.projects.filter(
      project => project.status === status
    );
  }

  private applyWorkloadFilter(data: DashboardData, workload: string): void {
    data.teamStats.members = data.teamStats.members.filter(member => {
      switch (workload) {
        case 'overloaded':
          return member.workload > 100;
        case 'optimal':
          return member.workload >= 70 && member.workload <= 100;
        case 'underloaded':
          return member.workload < 70;
        default:
          return true;
      }
    });
  }

  private applyAbsenceTypeFilter(data: DashboardData, type: string): void {
    data.absenceStats.absences = data.absenceStats.absences.filter(
      absence => absence.type === type
    );
  }

  private updateStats(data: DashboardData): DashboardData {
    // Update team stats
    data.teamStats.activeMembers = data.teamStats.members.length;
    data.teamStats.overloaded = data.teamStats.members.filter(m => m.workload > 100).length;
    data.teamStats.optimal = data.teamStats.members.filter(m => m.workload >= 70 && m.workload <= 100).length;
    data.teamStats.underloaded = data.teamStats.members.filter(m => m.workload < 70).length;

    // Update project stats
    data.projectStats.active = data.projectStats.projects.filter(p => p.status === 'active').length;
    data.projectStats.completed = data.projectStats.projects.filter(p => p.status === 'completed').length;
    data.projectStats.onHold = data.projectStats.projects.filter(p => p.status === 'on-hold').length;
    data.projectStats.delayed = data.projectStats.projects.filter(p => p.isDelayed).length;

    // Update absence stats
    data.absenceStats.pending = data.absenceStats.absences.filter(a => a.status === 'pending').length;
    data.absenceStats.approved = data.absenceStats.absences.filter(a => a.status === 'approved').length;
    data.absenceStats.rejected = data.absenceStats.absences.filter(a => a.status === 'rejected').length;
    data.absenceStats.byType = {
      vacation: data.absenceStats.absences.filter(a => a.type === 'vacation').length,
      sick: data.absenceStats.absences.filter(a => a.type === 'sick').length,
      remote: data.absenceStats.absences.filter(a => a.type === 'remote').length,
      other: data.absenceStats.absences.filter(a => a.type === 'other').length
    };

    return data;
  }
}