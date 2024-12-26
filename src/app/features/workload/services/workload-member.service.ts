import { Injectable } from '@angular/core';
import { TeamService } from '../../team/services/team.service';
import { ProjectService } from '../../projects/services/project.service';
import { TeamMember } from '../../team/models/team-member.model';
import { Project } from '../../projects/models/project.model';

@Injectable({
  providedIn: 'root'
})
export class WorkloadMemberService {
  private members: TeamMember[] = [];
  private projects: Project[] = [];

  constructor(
    private teamService: TeamService,
    private projectService: ProjectService
  ) {
    this.loadData();
  }

  private loadData(): void {
    this.teamService.getTeamMembers().subscribe(members => {
      this.members = members;
    });
    this.projectService.getProjects().subscribe(projects => {
      this.projects = projects;
    });
  }

  getMemberName(id: string): string {
    const member = this.members.find(m => m.id === id);
    return member ? `${member.firstName} ${member.lastName}` : 'Membre inconnu';
  }

  getMemberAvatar(id: string): string {
    const member = this.members.find(m => m.id === id);
    return member?.avatar || 'assets/default-avatar.png';
  }

  getProjectName(id: string): string {
    const project = this.projects.find(p => p.id === id);
    return project?.name || 'Projet inconnu';
  }
}