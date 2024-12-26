import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TeamMember } from '../models/team-member.model';
import { TeamService as FirebaseTeamService } from '../../../core/services/firebase/collections/team.service';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  constructor(private firebaseTeamService: FirebaseTeamService) {}

  getTeamMembers(): Observable<TeamMember[]> {
    return this.firebaseTeamService.getTeamMembers();
  }

  addMember(memberData: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>): Observable<string> {
    const newMember: Omit<TeamMember, 'id'> = {
      ...memberData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return this.firebaseTeamService.addMember(newMember);
  }

  updateMember(id: string, memberData: Partial<TeamMember>): Observable<void> {
    const updateData: Partial<TeamMember> = {
      ...memberData,
      updatedAt: new Date()
    };
    return this.firebaseTeamService.updateMember(id, updateData);
  }

  deleteMember(id: string): Observable<void> {
    return this.firebaseTeamService.deleteMember(id);
  }
}