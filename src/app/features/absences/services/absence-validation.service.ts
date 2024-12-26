import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Absence } from '../models/absence.model';
import { AbsenceService } from './absence.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UserService } from '../../../core/services/user.service';
import { AbsenceValidation, ValidationResult } from '../models/absence-validation.model';

@Injectable({
  providedIn: 'root'
})
export class AbsenceValidationService {
  constructor(
    private absenceService: AbsenceService,
    private notificationService: NotificationService,
    private userService: UserService
  ) {}

  approveAbsence(absenceId: string, comment?: string): Observable<ValidationResult> {
    const validation: AbsenceValidation = {
      absenceId,
      validatedBy: this.userService.getCurrentUserId() || '',
      validatedAt: new Date(),
      status: 'approved',
      comment
    };

    return this.absenceService.updateAbsence(absenceId, {
      status: 'approved',
      validatedBy: validation.validatedBy,
      validatedAt: validation.validatedAt,
      validationComment: comment
    }).pipe(
      map(() => {
        this.notificationService.success('Absence approuvée avec succès');
        return {
          success: true,
          message: 'Absence approuvée avec succès'
        };
      })
    );
  }

  rejectAbsence(absenceId: string, comment: string): Observable<ValidationResult> {
    if (!comment) {
      throw new Error('Un commentaire est requis pour le rejet');
    }

    const validation: AbsenceValidation = {
      absenceId,
      validatedBy: this.userService.getCurrentUserId() || '',
      validatedAt: new Date(),
      status: 'rejected',
      comment
    };

    return this.absenceService.updateAbsence(absenceId, {
      status: 'rejected',
      validatedBy: validation.validatedBy,
      validatedAt: validation.validatedAt,
      validationComment: comment
    }).pipe(
      map(() => {
        this.notificationService.error('Absence rejetée');
        return {
          success: true,
          message: 'Absence rejetée'
        };
      })
    );
  }

  getPendingAbsences(): Observable<Absence[]> {
    return this.absenceService.getAbsences().pipe(
      map(absences => absences.filter(absence => absence.status === 'pending'))
    );
  }
}