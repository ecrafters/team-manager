import { Injectable } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { AbsencesService } from '../../core/services/firebase/collections/absences.service';
import { ProjectsService } from '../../core/services/firebase/collections/projects.service';
import { TeamService } from '../../core/services/firebase/collections/team.service';
import { WorkloadService } from '../../core/services/firebase/collections/workload.service';
import { DashboardData, DashboardMember, DashboardProject } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    private absencesService: AbsencesService,
    private projectsService: ProjectsService,
    private teamService: TeamService,
    private workloadService: WorkloadService
  ) {}

  getDashboardStats(): Observable<DashboardData> {
    return combineLatest([
      this.absencesService.getAbsences(),
      this.projectsService.getProjects(),
      this.teamService.getTeamMembers(),
      this.workloadService.getWorkloads()
    ]).pipe(
      map(([absences, projects, members, workloads]) => {
        // Map team members with workload data
        const dashboardMembers: DashboardMember[] = members.map(member => {
          const memberWorkloads = workloads.filter(w => w.userId === member.id);
          const totalWorkload = memberWorkloads.reduce((sum, w) => sum + w.allocation, 0);
          const projectCount = new Set(memberWorkloads.map(w => w.projectId)).size;

          return {
            ...member,
            workload: totalWorkload,
            projectCount
          };
        });

        // Map projects with delay status
        const dashboardProjects: DashboardProject[] = projects.map(project => ({
          ...project,
          isDelayed: project.status === 'active' && new Date(project.endDate) < new Date()
        }));

        return {
          teamStats: {
            members: dashboardMembers,
            activeMembers: dashboardMembers.length,
            overloaded: dashboardMembers.filter(m => m.workload > 100).length,
            optimal: dashboardMembers.filter(m => m.workload >= 70 && m.workload <= 100).length,
            underloaded: dashboardMembers.filter(m => m.workload < 70).length
          },
          projectStats: {
            projects: dashboardProjects,
            active: dashboardProjects.filter(p => p.status === 'active').length,
            completed: dashboardProjects.filter(p => p.status === 'completed').length,
            onHold: dashboardProjects.filter(p => p.status === 'on-hold').length,
            delayed: dashboardProjects.filter(p => p.isDelayed).length
          },
          absenceStats: {
            absences,
            pending: absences.filter(a => a.status === 'pending').length,
            approved: absences.filter(a => a.status === 'approved').length,
            rejected: absences.filter(a => a.status === 'rejected').length,
            byType: {
              vacation: absences.filter(a => a.type === 'vacation').length,
              sick: absences.filter(a => a.type === 'sick').length,
              remote: absences.filter(a => a.type === 'remote').length,
              other: absences.filter(a => a.type === 'other').length
            }
          }
        };
      })
    );
  }
}