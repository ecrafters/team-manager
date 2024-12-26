import { Injectable } from '@angular/core';
import { Absence } from '../models/absence.model';
import { AbsenceFilters } from '../components/absence-filters/absence-filters.component';

@Injectable({
  providedIn: 'root'
})
export class AbsenceFilterService {
  filterAbsences(absences: Absence[], filters: AbsenceFilters): Absence[] {
    return absences.filter(absence => {
      // Filter by member
      if (filters.memberId && absence.userId !== filters.memberId) {
        return false;
      }

      // Filter by type
      if (filters.type && absence.type !== filters.type) {
        return false;
      }

      // Filter by date range
      if (filters.startDate) {
        const filterStart = new Date(filters.startDate);
        const absenceStart = new Date(absence.startDate);
        if (absenceStart < filterStart) {
          return false;
        }
      }

      if (filters.endDate) {
        const filterEnd = new Date(filters.endDate);
        const absenceEnd = new Date(absence.endDate);
        if (absenceEnd > filterEnd) {
          return false;
        }
      }

      return true;
    });
  }
}