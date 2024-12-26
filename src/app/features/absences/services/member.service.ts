import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { TeamService } from '../../team/services/team.service';
import { TeamMember } from '../../team/models/team-member.model';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private members: TeamMember[] = [];

  constructor(private teamService: TeamService) {
    this.loadMembers();
  }

  private loadMembers(): void {
    this.teamService.getTeamMembers().subscribe(members => {
      this.members = members;
    });
  }

  getMemberById(id: string): TeamMember | undefined {
    return this.members.find(member => member.id === id);
  }

  getMemberName(id: string): string {
    const member = this.getMemberById(id);
    return member ? `${member.firstName} ${member.lastName}` : 'Membre inconnu';
  }

  getMemberAvatar(id: string): string {
    const member = this.getMemberById(id);
    return member?.avatar || 'assets/default-avatar.png';
  }
}