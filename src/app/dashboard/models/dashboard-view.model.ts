import { DashboardStat } from '../components/dashboard-stats/dashboard-stats.component';
import { MemberWorkload } from '../components/member-workload/member-workload.component';

export interface DashboardViewModel {
  stats: DashboardStat[];
  memberWorkloads: MemberWorkload[];
  projectStats: {
    active: number;
    completed: number;
    onHold: number;
    delayed: number;
  };
  teamStats: {
    activeMembers: number;
    overloaded: number;
    optimal: number;
    underloaded: number;
  };
  absenceStats: {
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