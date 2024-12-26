import { Injectable } from '@angular/core';
import { Workload } from '../../../core/models/firestore/workload.model';
import { WorkloadFilters } from '../components/workload-filters/workload-filters.component';

@Injectable({
  providedIn: 'root'
})
export class WorkloadFilterService {
  filterWorkloads(workloads: Workload[], filters: WorkloadFilters): Workload[] {
    return workloads.filter(workload => {
      // Filter by member
      if (filters.memberId && workload.userId !== filters.memberId) {
        return false;
      }

      // Filter by project
      if (filters.projectId && workload.projectId !== filters.projectId) {
        return false;
      }

      // Filter by date range
      if (filters.startDate) {
        const filterStart = new Date(filters.startDate);
        const workloadStart = new Date(workload.startDate);
        if (workloadStart < filterStart) {
          return false;
        }
      }

      if (filters.endDate) {
        const filterEnd = new Date(filters.endDate);
        const workloadEnd = new Date(workload.endDate);
        if (workloadEnd > filterEnd) {
          return false;
        }
      }

      return true;
    });
  }
}