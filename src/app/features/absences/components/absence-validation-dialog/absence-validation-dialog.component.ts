import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Absence } from '../../models/absence.model';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-absence-validation-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="dialog-overlay" (click)="onOverlayClick($event)">
      <div class="dialog-content">
        <div class="dialog-header">
          <h3>{{ isRejection ? 'Rejeter' : 'Approuver' }} la demande d'absence</h3>
          <button class="close-btn" (click)="onCancel.emit()">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="absence-details">
          <p><strong>Membre :</strong> {{ userName }}</p>
          <p><strong>Type :</strong> {{ getAbsenceType(absence.type) }}</p>
          <p><strong>Période :</strong> {{ formatDateRange(absence.startDate, absence.endDate) }}</p>
          <p *ngIf="absence.reason"><strong>Motif :</strong> {{ absence.reason }}</p>
        </div>
        
        <form [formGroup]="validationForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="comment">
              {{ isRejection ? 'Motif du rejet *' : 'Commentaire (optionnel)' }}
            </label>
            <textarea
              id="comment"
              formControlName="comment"
              rows="3"
              [placeholder]="getPlaceholder()"
              class="form-control"
            ></textarea>
            <div *ngIf="showError" class="error-message">
              Le motif est requis pour un rejet
            </div>
          </div>

          <div class="dialog-actions">
            <button type="button" class="btn-cancel" (click)="onCancel.emit()">
              Annuler
            </button>
            <button 
              type="submit"
              [class]="isRejection ? 'btn-reject' : 'btn-approve'"
              [disabled]="!validationForm.valid"
            >
              {{ isRejection ? 'Rejeter' : 'Approuver' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .dialog-content {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      width: 100%;
      max-width: 500px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .close-btn {
      background: none;
      border: none;
      color: #666;
      cursor: pointer;
      padding: 0.5rem;
    }

    .absence-details {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 6px;
      margin-bottom: 1.5rem;
    }

    .absence-details p {
      margin-bottom: 0.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      resize: vertical;
    }

    .error-message {
      color: #e74c3c;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .dialog-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .btn-cancel {
      background: #e0e0e0;
    }

    .btn-approve {
      background: #27ae60;
      color: white;
    }

    .btn-reject {
      background: #e74c3c;
      color: white;
    }

    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  `]
})
export class AbsenceValidationDialogComponent implements OnInit {
  @Input() absence!: Absence;
  @Input() isRejection = false;
  @Output() validate = new EventEmitter<string>();
  @Output() onCancel = new EventEmitter<void>();

  validationForm: FormGroup;
  userName = '';
  showError = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.validationForm = this.fb.group({
      comment: ['', this.isRejection ? Validators.required : []]
    });
  }

  ngOnInit(): void {
    this.loadUserDetails();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('dialog-overlay')) {
      this.onCancel.emit();
    }
  }

  getAbsenceType(type: string): string {
    const types: Record<string, string> = {
      vacation: 'Congés',
      sick: 'Maladie',
      remote: 'Télétravail',
      other: 'Autre'
    };
    return types[type] || type;
  }

  formatDateRange(start: Date, end: Date): string {
    return `Du ${new Date(start).toLocaleDateString()} au ${new Date(end).toLocaleDateString()}`;
  }

  getPlaceholder(): string {
    return this.isRejection 
      ? 'Veuillez expliquer la raison du rejet...'
      : 'Ajouter un commentaire (optionnel)...';
  }

  onSubmit(): void {
    if (this.validationForm.valid) {
      const comment = this.validationForm.get('comment')?.value;
      if (this.isRejection && !comment) {
        this.showError = true;
        return;
      }
      this.validate.emit(comment);
    }
  }

  private loadUserDetails(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        if (user) {
          this.userName = `${user.firstName} ${user.lastName}`;
        }
      },
      error: (error) => console.error('Error loading user details:', error)
    });
  }
}