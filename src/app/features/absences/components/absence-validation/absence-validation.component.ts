import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Absence } from '../../models/absence.model';
import { AbsenceValidationService } from '../../services/absence-validation.service';

@Component({
  selector: 'app-absence-validation',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="validation-dialog">
      <h3>{{ isRejection ? 'Rejeter' : 'Approuver' }} la demande</h3>
      
      <form [formGroup]="validationForm" (ngSubmit)="onSubmit()">
        <div class="form-group" *ngIf="isRejection">
          <label for="comment">Motif du rejet *</label>
          <textarea
            id="comment"
            formControlName="comment"
            class="form-control"
            rows="3"
            placeholder="Expliquez la raison du rejet..."
          ></textarea>
          <div class="error-message" *ngIf="validationForm.get('comment')?.touched && validationForm.get('comment')?.errors?.['required']">
            Le motif est requis pour un rejet
          </div>
        </div>

        <div class="form-group" *ngIf="!isRejection">
          <label for="comment">Commentaire (optionnel)</label>
          <textarea
            id="comment"
            formControlName="comment"
            class="form-control"
            rows="3"
            placeholder="Ajouter un commentaire..."
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-cancel" (click)="onCancel()">
            Annuler
          </button>
          <button 
            type="submit" 
            [class]="isRejection ? 'btn-reject' : 'btn-approve'"
            [disabled]="!validationForm.valid">
            {{ isRejection ? 'Rejeter' : 'Approuver' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .validation-dialog {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      resize: vertical;
    }

    .error-message {
      color: #e74c3c;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }

    .btn-cancel {
      background: #e0e0e0;
    }

    .btn-approve {
      background: #27ae60;
      color: white;
      flex: 1;
    }

    .btn-reject {
      background: #e74c3c;
      color: white;
      flex: 1;
    }

    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  `]
})
export class AbsenceValidationComponent {
  @Input() absence!: Absence;
  @Input() isRejection = false;
  @Output() validate = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  validationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private validationService: AbsenceValidationService
  ) {
    this.validationForm = this.fb.group({
      comment: ['', this.isRejection ? Validators.required : []]
    });
  }

  onSubmit(): void {
    if (this.validationForm.valid) {
      const comment = this.validationForm.get('comment')?.value;
      
      if (this.isRejection) {
        this.validationService.rejectAbsence(this.absence.id!, comment)
          .subscribe(() => this.validate.emit());
      } else {
        this.validationService.approveAbsence(this.absence.id!, comment)
          .subscribe(() => this.validate.emit());
      }
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}