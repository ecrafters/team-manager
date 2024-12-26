import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeamMember } from '../../models/team-member.model';

@Component({
  selector: 'app-team-member-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="memberForm" (ngSubmit)="onSubmit()" class="member-form">
      <h3>{{ editMode ? 'Modifier' : 'Ajouter' }} un membre</h3>
      
      <div class="photo-upload">
        <img [src]="previewUrl || member?.avatar || 'assets/default-avatar.png'" 
             alt="Photo de profil" 
             class="avatar-preview">
        <div class="upload-controls">
          <label for="avatar" class="upload-btn">
            <i class="fas fa-camera"></i>
            Changer la photo
          </label>
          <input type="file" 
                 id="avatar" 
                 (change)="onFileSelected($event)"
                 accept="image/*"
                 style="display: none">
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label for="firstName">Prénom *</label>
          <input type="text" 
                 id="firstName" 
                 formControlName="firstName" 
                 class="form-control"
                 placeholder="Prénom">
          <div class="error-message" *ngIf="memberForm.get('firstName')?.touched && memberForm.get('firstName')?.errors?.['required']">
            Le prénom est requis
          </div>
        </div>

        <div class="form-group">
          <label for="lastName">Nom *</label>
          <input type="text" 
                 id="lastName" 
                 formControlName="lastName" 
                 class="form-control"
                 placeholder="Nom">
          <div class="error-message" *ngIf="memberForm.get('lastName')?.touched && memberForm.get('lastName')?.errors?.['required']">
            Le nom est requis
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email *</label>
          <input type="email" 
                 id="email" 
                 formControlName="email" 
                 class="form-control"
                 placeholder="email@exemple.com">
          <div class="error-message" *ngIf="memberForm.get('email')?.touched && memberForm.get('email')?.errors?.['required']">
            L'email est requis
          </div>
          <div class="error-message" *ngIf="memberForm.get('email')?.touched && memberForm.get('email')?.errors?.['email']">
            Format d'email invalide
          </div>
        </div>

        <div class="form-group">
          <label for="role">Rôle *</label>
          <select id="role" formControlName="role" class="form-control">
            <option value="developer">Développeur</option>
            <option value="manager">Manager</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>

        <div class="form-group">
          <label for="department">Département</label>
          <input type="text" 
                 id="department" 
                 formControlName="department" 
                 class="form-control"
                 placeholder="Département">
        </div>

        <div class="form-group">
          <label for="phone">Téléphone</label>
          <input type="tel" 
                 id="phone" 
                 formControlName="phone" 
                 class="form-control"
                 placeholder="+33 6 12 34 56 78">
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn-cancel" (click)="onCancel()">
          Annuler
        </button>
        <button type="submit" 
                class="btn-submit" 
                [disabled]="!memberForm.valid || isSubmitting">
          {{ editMode ? 'Modifier' : 'Ajouter' }}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .member-form {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .photo-upload {
      text-align: center;
      margin-bottom: 2rem;
    }

    .avatar-preview {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: 1rem;
      border: 3px solid #f5f5f5;
    }

    .upload-controls {
      display: flex;
      justify-content: center;
    }

    .upload-btn {
      background: #3498db;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background-color 0.3s;
    }

    .upload-btn:hover {
      background: #2980b9;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    label {
      margin-bottom: 0.5rem;
      color: #666;
    }

    .form-control {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    .form-control:focus {
      outline: none;
      border-color: #3498db;
    }

    .error-message {
      color: #e74c3c;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.3s;
    }

    .btn-cancel {
      background: #e0e0e0;
    }

    .btn-cancel:hover {
      background: #bdc3c7;
    }

    .btn-submit {
      background: #3498db;
      color: white;
    }

    .btn-submit:hover {
      background: #2980b9;
    }

    .btn-submit:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TeamMemberFormComponent {
  @Input() editMode = false;
  @Input() member: TeamMember | undefined;
  @Output() submitMember = new EventEmitter<Partial<TeamMember>>();
  @Output() cancel = new EventEmitter<void>();

  memberForm: FormGroup;
  previewUrl: string | null = null;
  selectedFile: File | null = null;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {
    this.memberForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['developer', Validators.required],
      department: [''],
      phone: [''],
      avatar: ['']
    });

    if (this.editMode && this.member) {
      this.memberForm.patchValue(this.member);
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