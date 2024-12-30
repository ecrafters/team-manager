import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { AbsenceService } from "../../services/absence.service";
import { TeamService } from "../../../team/services/team.service";
import { TeamMember } from "../../../team/models/team-member.model";
import { Absence } from "../../models/absence.model";

@Component({
  selector: "app-absence-form",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="absence-form">
      <h3>{{ editMode ? "Modifier" : "Déclarer" }} une absence</h3>
      <form [formGroup]="absenceForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="userId">Membre</label>
          <select id="userId" formControlName="userId" class="form-control">
            <option value="">Sélectionner un membre</option>
            <option *ngFor="let member of teamMembers" [value]="member.id">
              {{ member.firstName }} {{ member.lastName }}
            </option>
          </select>
          <div
            *ngIf="
              absenceForm.get('userId')?.invalid &&
              absenceForm.get('userId')?.touched
            "
            class="error-message"
          >
            Le membre est requis.
          </div>
        </div>

        <div class="form-group">
          <label for="type">Type d'absence</label>
          <select id="type" formControlName="type" class="form-control">
            <option value="vacation">Congés</option>
            <option value="sick">Maladie</option>
            <option value="remote">Télétravail</option>
            <option value="other">Autre</option>
          </select>
        </div>

        <div class="form-group">
          <label for="startDate">Date de début</label>
          <input
            type="date"
            id="startDate"
            formControlName="startDate"
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="endDate">Date de fin</label>
          <input
            type="date"
            id="endDate"
            formControlName="endDate"
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="reason">Motif (optionnel)</label>
          <textarea
            id="reason"
            formControlName="reason"
            class="form-control"
            rows="3"
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-cancel" (click)="onCancel()">
            Annuler
          </button>
          <button type="submit" [disabled]="!absenceForm.valid">
            {{ editMode ? "Modifier" : "Soumettre" }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .absence-form {
        background: #ffffff;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        max-width: 600px;
        margin: 0 auto;
      }

      h3 {
        font-size: 1.5rem;
        color: #2c3e50;
        margin-bottom: 1.5rem;
        text-align: center;
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      label {
        display: block;
        font-size: 0.875rem;
        color: #34495e;
        font-weight: 500;
        margin-bottom: 0.5rem;
      }

      .form-control {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #dcdcdc;
        border-radius: 6px;
        font-size: 1rem;
        background: #f9f9f9;
        transition: border-color 0.3s, box-shadow 0.3s;
      }

      .form-control:focus {
        border-color: #3498db;
        box-shadow: 0 0 6px rgba(52, 152, 219, 0.3);
        outline: none;
      }

      textarea {
        resize: none;
      }

      .form-actions {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        margin-top: 2rem;
      }

      button {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 6px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.3s, transform 0.2s;
      }

      button:active {
        transform: scale(0.98);
      }

      .btn-cancel {
        background: #e0e0e0;
        color: #34495e;
      }

      .btn-cancel:hover {
        background: #d6d6d6;
      }

      button[type="submit"] {
        background: #3498db;
        color: #ffffff;
        flex: 1;
      }

      button[type="submit"]:hover {
        background: #2980b9;
      }

      button:disabled {
        background: #bdc3c7;
        cursor: not-allowed;
      }

      .error-message {
        color: #e74c3c;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }
    `,
  ],
})
export class AbsenceFormComponent {
  @Input() editMode = false;
  @Input() absence: Absence | undefined;
  @Output() submitAbsence = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  absenceForm: FormGroup;
  teamMembers: TeamMember[] = [];

  constructor(
    private fb: FormBuilder,
    private absenceService: AbsenceService,
    private teamService: TeamService
  ) {
    this.absenceForm = this.fb.group({
      userId: ["", Validators.required],
      type: ["vacation", Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      reason: [""],
    });
  }

  ngOnInit(): void {
    this.loadTeamMembers();
    if (this.editMode && this.absence) {
      this.absenceForm.patchValue({
        userId: this.absence.userId,
        type: this.absence.type,
        startDate: this.formatDate(this.absence.startDate),
        endDate: this.formatDate(this.absence.endDate),
        reason: this.absence.reason,
      });
    }
  }

  private loadTeamMembers(): void {
    this.teamService.getTeamMembers().subscribe({
      next: (members) => (this.teamMembers = members),
      error: (error) => console.error("Error loading team members:", error),
    });
  }

  private formatDate(date: Date): string {
    return new Date(date).toISOString().split("T")[0];
  }

  onSubmit(): void {
    if (this.absenceForm.valid) {
      this.submitAbsence.emit(this.absenceForm.value);
      this.absenceForm.reset({
        type: "vacation",
      });
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
