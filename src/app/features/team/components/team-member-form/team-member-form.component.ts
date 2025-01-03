import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TeamMember } from '../../models/team-member.model';

@Component({
  selector: 'app-team-member-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form
      [formGroup]="memberForm"
      (ngSubmit)="onSubmit()"
      class="member-form"
    >
      <h3 class="form-title">
        {{ editMode ? 'Modifier' : 'Ajouter' }} un membre
      </h3>

      <div class="photo-upload">
        <img
          [src]="previewUrl || member?.avatar || 'assets/default-avatar.png'"
          alt="Photo de profil"
          class="avatar-preview"
        />
        <div class="upload-controls">
          <label for="avatar" class="upload-btn">
            <i class="fas fa-camera"></i> Changer la photo
          </label>
          <input
            type="file"
            id="avatar"
            (change)="onFileSelected($event)"
            accept="image/*"
            style="display: none"
          />
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label for="firstName">Prénom *</label>
          <input
            type="text"
            id="firstName"
            formControlName="firstName"
            class="form-control"
            placeholder="Prénom"
          />
          <div
            class="error-message"
            *ngIf="
              memberForm.get('firstName')?.touched &&
              memberForm.get('firstName')?.errors?.['required']
            "
          >
            Le prénom est requis
          </div>
        </div>

        <div class="form-group">
          <label for="lastName">Nom *</label>
          <input
            type="text"
            id="lastName"
            formControlName="lastName"
            class="form-control"
            placeholder="Nom"
          />
          <div
            class="error-message"
            *ngIf="
              memberForm.get('lastName')?.touched &&
              memberForm.get('lastName')?.errors?.['required']
            "
          >
            Le nom est requis
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email *</label>
          <input
            type="email"
            id="email"
            formControlName="email"
            class="form-control"
            placeholder="email@exemple.com"
          />
          <div
            class="error-message"
            *ngIf="
              memberForm.get('email')?.touched &&
              memberForm.get('email')?.errors?.['required']
            "
          >
            L'email est requis
          </div>
          <div
            class="error-message"
            *ngIf="
              memberForm.get('email')?.touched &&
              memberForm.get('email')?.errors?.['email']
            "
          >
            Format d'email invalide
          </div>
        </div>

        <div class="form-group">
          <label for="role">Rôle *</label>
          <select id="role" formControlName="role" class="form-control">
            <option *ngFor="let role of roles" [value]="role.value">
              {{ role.label }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="department">Département</label>
          <input
            type="text"
            id="department"
            formControlName="department"
            class="form-control"
            placeholder="Département"
          />
        </div>

        <div class="form-group">
          <label for="phone">Téléphone</label>
          <input
            type="tel"
            id="phone"
            formControlName="phone"
            class="form-control"
            placeholder="+33 6 12 34 56 78"
          />
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn-cancel" (click)="onCancel()">
          Annuler
        </button>
        <button
          type="submit"
          class="btn-submit"
          [disabled]="!memberForm.valid || isSubmitting"
        >
          {{ editMode ? 'Modifier' : 'Ajouter' }}
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      .member-form {
        background: #ffffff;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        max-width: 600px;
        margin: auto;
        animation: fadeInUp 0.5s ease-in-out;
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .form-title {
        font-size: 1.8rem;
        color: #2c3e50;
        text-align: center;
        margin-bottom: 1.5rem;
        font-weight: bold;
      }

      .photo-upload {
        text-align: center;
        margin-bottom: 2rem;
      }

      .avatar-preview {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        object-fit: cover;
        margin-bottom: 1rem;
        border: 3px solid #e3e3e3;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .avatar-preview:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
      }

      .upload-btn {
        background: #3498db;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-size: 0.9rem;
        cursor: pointer;
        transition: background 0.3s ease, transform 0.2s ease;
      }

      .upload-btn:hover {
        background: #2980b9;
        transform: scale(1.05);
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
      }

      label {
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: #34495e;
      }

      .form-control {
        padding: 0.75rem;
        border: 1px solid #dcdcdc;
        border-radius: 6px;
        font-size: 1rem;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
      }

      .form-control:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 10px rgba(52, 152, 219, 0.4);
      }

      .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 1.5rem;
      }

      .btn-cancel {
        background: #bdc3c7;
        color: #2c3e50;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.3s ease;
      }

      .btn-cancel:hover {
        background: #95a5a6;
      }

      .btn-submit {
        background: #27ae60;
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.3s ease;
      }

      .btn-submit:hover {
        background: #1e8449;
      }
    `,
  ],
})
export class TeamMemberFormComponent implements OnChanges {
  @Input() editMode = false;
  @Input() member: TeamMember | undefined;
  @Output() submitMember = new EventEmitter<Partial<TeamMember>>();
  @Output() cancel = new EventEmitter<void>();

  memberForm: FormGroup;
  previewUrl: string | null = null;
  selectedFile: File | null = null;
  isSubmitting = false;

  roles = [
    { value: 'admin', label: 'Administrateur' },
    { value: 'manager', label: 'Manager' },
    { value: 'developer', label: 'Développeur' },
    { value: 'tester', label: 'Testeur' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'devops', label: 'DevOps' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'accounting', label: 'Comptabilité' },
    { value: 'rh', label: 'Ressources Humaines' },
  ];
  
  

  constructor(private fb: FormBuilder) {
    this.memberForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['developer', Validators.required],
      department: [''],
      phone: [''],
      avatar: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['member'] && this.member) {
      this.memberForm.patchValue(this.member);
      this.previewUrl = this.member.avatar || null;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (this.memberForm.valid) {
      this.isSubmitting = true;
      const formData = this.memberForm.value;
      if (this.previewUrl) {
        formData.avatar = this.previewUrl;
      }
      this.submitMember.emit(formData);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
