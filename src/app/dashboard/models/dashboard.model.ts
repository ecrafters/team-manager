import { TeamMember } from '../../core/models/firestore/team-member.model';
import { Project } from '../../core/models/firestore/project.model';
import { Absence } from '../../core/models/firestore/absence.model';

export interface DashboardMember extends TeamMember {
  workload: number;
  projectCount: number;
}

export interface DashboardProject extends Project {
  isDelayed: boolean;
}

export interface DashboardData {
  teamStats: {
    members: DashboardMember[];
    activeMembers: number;
    overloaded: number;
    optimal: number;
    underloaded: number;
  };
  projectStats: {
    projects: DashboardProject[];
    active: number;
    completed: number;
    onHold: number;
    delayed: number;
  };
  absenceStats: {
    absences: Absence[];
    pending: number;
    approved: number;
    rejected: number;
    byType: {
      vacation: number;
      sick: number;
      remote: number;
      other: number;
    };
  };
}