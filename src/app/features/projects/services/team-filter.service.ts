import { Injectable } from '@angular/core';
import { TeamMember } from '../../../core/models/firestore/team-member.model';
import { TeamFilters } from '../components/project-team-filters/project-team-filters.component';

@Injectable({
  providedIn: 'root'
})
export class TeamFilterService {
  filterTeamMembers(members: TeamMember[], filters: TeamFilters): TeamMember[] {
    return members.filter(member => {
      // Filter by firstName
      if (filters.firstName && !member.firstName.toLowerCase().includes(filters.firstName.toLowerCase())) {
        return false;
      }

      // Filter by lastName
      if (filters.lastName && !member.lastName.toLowerCase().includes(filters.lastName.toLowerCase())) {
        return false;
      }

      // Filter by email
      if (filters.email && !member.email.toLowerCase().includes(filters.email.toLowerCase())) {
        return false;
      }

      // Filter by role
      if (filters.role && member.role !== filters.role) {
        return false;
      }

      // Filter by department
      if (filters.department && !member.department?.toLowerCase().includes(filters.department.toLowerCase())) {
        return false;
      }

      // Filter by phone
      if (filters.phone && !member.phone?.includes(filters.phone)) {
        return false;
      }

      return true;
    });
  }
}