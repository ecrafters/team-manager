import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Absence } from '../models/absence.model';
import { MOCK_ABSENCES } from '../../../core/services/mock/mock-data';

@Injectable({
  providedIn: 'root'
})
export class MockAbsenceService {
  private absences = MOCK_ABSENCES;

  getAbsences(): Observable<Absence[]> {
    return of(this.absences);
  }

  createAbsence(absence: Omit<Absence, 'id'>): Observable<Absence> {
    const newAbsence: Absence = {
      ...absence,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending'
    };
    this.absences.push(newAbsence);
    return of(newAbsence);
  }
}