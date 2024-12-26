```typescript
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role, Permission } from '../../models/role.model';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="role-form">
      <h3>{{ editMode ? 'Modifier' : 'Créer' }} un rôle</h3>

      <form [formGroup]="roleForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="name">Nom du rôle *</label>
          <input 
            type="text" 
            id="name" 
            formControlName="name" 
            class="form-control"
            placeholder="Ex: Manager de projet"
          >
        </div>

        <div class="form-group">
          <label for="description">Description *</label>
          <textarea 
            id="description" 
            formControlName="description" 
            class="form-control"
            rows="3"
            placeholder="Décrivez les responsabilités de ce rôle..."
          ></textarea>
        </div>

        <div class="permissions-section">
          <h4>Permissions</h4>
          
          <div class="module-permissions">
            <div class="module-group" *ngFor="let module of modules">
              <h5>{{ getModuleLabel(module) }}</h5>
              
              <div class="permissions-list">
                <div *ngFor="let permission of getModulePermissions(module)" 
                     class="permission-item">
                  <label [for]="permission.id" class="permission-label">
                    <input 
                      type="checkbox" 
                      [id]="permission.id"
                      [checked]="isPermissionSelected(permission)"
                      (change)="togglePermission(permission)"
                    >
                    <div class="permission-info">
                      <span class="permission-name">{{ permission.name }}</span>
                      <span class="permission-description">{{ permission.description }}</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-cancel" (click)="onCancel.emit()">
            Annuler
          </button>
          <button 
            type="submit" 
            class="btn-submit" 
            [disabled]="!roleForm.valid || isSubmitting"
          >
            {{ isSubmitting ? 'Enregistrement...' : (editMode ? 'Modifier' : 'Créer') }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .role-form {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .permissions-section {
      margin: 2rem 0;
    }

    .module-group {
      margin-bottom: 2rem;

      h5 {
        color: #2c3e50;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #eee;
      }
    }

    .permissions-list {
      display: grid;
      gap: 1rem;
    }

    .permission-item {
      background: #f8f9fa;
      border-radius: 6px;
      transition: background-color 0.3s;

      &:hover {
        background: #f1f3f5;
      }
    }

    .permission-label {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
      cursor: pointer;

      input[type="checkbox"] {
        margin-top: 0.25rem;
      }
    }

    .permission-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .permission-name {
      font-weight: 500;
      color: #2c3e50;
    }

    .permission-description {
      font-size: 0.875rem;
      color: #666;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }

    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.3s;
    }

    .btn-cancel {
      background: #e0e0e0;
      color: #666;

      &:hover {
        background: #d5d5d5;
      }
    }

    .btn-submit {
      background: #3498db;
      color: white;

      &:hover {
        background: #2980b9;
      }

      &:disabled {
        background: #bdc3c7;
        cursor: not-allowed;
      }
    }
  `]
})
export class RoleFormComponent {
  @Input() editMode = false;
  @Input() role?: Role;
  @Output() submitRole = new EventEmitter<Partial<Role>>();
  @Output() onCancel = new EventEmitter<void>();

  roleForm: FormGroup;
  isSubmitting = false;
  selectedPermissions: Permission[] = [];
  modules = ['team', 'projects', 'absences', 'workload', 'settings'] as const;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService
  ) {
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });

    if (this.editMode && this.role) {
      this.roleForm.patchValue({
        name: this.role.name,
        description: this.role.description
      });
      this.selectedPermissions = [...this.role.permissions];
    }
  }

  getModuleLabel(module: string): string {
    const labels: Record<string, string> = {
      team: 'Équipe',
      projects: 'Projets',
      absences: 'Absences',
      workload: 'Charge de travail',
      settings: 'Paramètres'
    };
    return labels[module] || module;
  }

  getModulePermissions(module: string): Permission[] {
    return this.roleService.getDefaultPermissions()
      .filter(permission => permission.module === module);
  }

  isPermissionSelected(permission: Permission): boolean {
    return this.selectedPermissions.some(p => p.id === permission.id);
  }

  togglePermission(permission: Permission): void {
    const index = this.selectedPermissions.findIndex(p => p.id === permission.id);
    if (index === -1) {
      this.selectedPermissions.push(permission);
    } else {
      this.selectedPermissions.splice(index, 1);
    }
  }

  onSubmit(): void {
    if (this.roleForm.valid) {
      this.isSubmitting = true;
      const formData = this.roleForm.value;
      
      const roleData: Partial<Role> = {
        name: formData.name,
        description: formData.description,
        permissions: this.selectedPermissions,
        isDefault: false
      };

      this.submitRole.emit(roleData);
    }
  }
}
```