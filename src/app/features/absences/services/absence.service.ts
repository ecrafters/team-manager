import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Absence } from '../models/absence.model';
import { AbsencesService } from '../../../core/services/firebase/collections/absences.service';

@Injectable({
  providedIn: 'root'
})
export class AbsenceService {
  constructor(private absencesService: AbsencesService) {}

  getAbsences(): Observable<Absence[]> {
    return this.absencesService.getAbsences();
  }

  addAbsence(absence: Omit<Absence, 'id' | 'createdAt' | 'updatedAt'>): Observable<string> {
    const newAbsence = {
      ...absence,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return this.absencesService.addAbsence(newAbsence);
  }

  updateAbsence(id: string, absence: Partial<Absence>): Observable<void> {
    const updatedAbsence = {
      ...absence,
      updatedAt: new Date()
    };
    return this.absencesService.updateAbsence(id, updatedAbsence);
  }

  deleteAbsence(id: string): Observable<void> {
    return this.absencesService.deleteAbsence(id);
  }
}