import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbsenceValidationTableComponent } from '../../components/absence-validation-table/absence-validation-table.component';
import { AbsenceValidationDialogComponent } from '../../components/absence-validation-dialog/absence-validation-dialog.component';
import { AbsenceValidationService } from '../../services/absence-validation.service';
import { Absence } from '../../models/absence.model';

@Component({
  selector: 'app-absence-validation',
  standalone: true,
  imports: [
    CommonModule, 
    AbsenceValidationTableComponent,
    AbsenceValidationDialogComponent
  ],
  template: `
    <div class="validation-page">
      <header class="page-header">
        <h1>Validation des absences</h1>
      </header>

      <app-absence-validation-table
        [absences]="pendingAbsences"
        (onApprove)="showApprovalDialog($event)"
        (onReject)="showRejectionDialog($event)"
      ></app-absence-validation-table>

      <app-absence-validation-dialog
        *ngIf="selectedAbsence"
        [absence]="selectedAbsence"
        [isRejection]="isRejectionDialog"
        (validate)="validateAbsence($event)"
        (onCancel)="closeDialog()"
      ></app-absence-validation-dialog>
    </div>
  `,
  styles: [`
    .validation-page {
      padding: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 2rem;
    }
  `]
})
export class AbsenceValidationPage implements OnInit {
  pendingAbsences: Absence[] = [];
  selectedAbsence: Absence | null = null;
  isRejectionDialog = false;

  constructor(private validationService: AbsenceValidationService) {}

  ngOnInit(): void {
    this.loadPendingAbsences();
  }

  private loadPendingAbsences(): void {
    this.validationService.getPendingAbsences().subscribe({
      next: (absences) => this.pendingAbsences = absences,
      error: (error) => console.error('Error loading pending absences:', error)
    });
  }

  showApprovalDialog(absence: Absence): void {
    this.selectedAbsence = absence;
    this.isRejectionDialog = false;
  }

  showRejectionDialog(absence: Absence): void {
    this.selectedAbsence = absence;
    this.isRejectionDialog = true;
  }

  validateAbsence(comment?: string): void {
    if (!this.selectedAbsence) return;

    const validation$ = this.isRejectionDialog
      ? this.validationService.rejectAbsence(this.selectedAbsence.id!, comment!)
      : this.validationService.approveAbsence(this.selectedAbsence.id!, comment);

    validation$.subscribe({
      next: () => {
        this.loadPendingAbsences();
        this.closeDialog();
      },
      error: (error) => console.error('Error validating absence:', error)
    });
  }

  closeDialog(): void {
    this.selectedAbsence = null;
  }
}