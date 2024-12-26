```typescript
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleFormComponent } from '../role-form/role-form.component';
import { Role } from '../../models/role.model';

@Component({
  selector: 'app-role-dialog',
  standalone: true,
  imports: [CommonModule, RoleFormComponent],
  template: `
    <div class="dialog-overlay" (click)="onOverlayClick($event)">
      <div class="dialog-content">
        <div class="dialog-header">
          <h2>{{ editMode ? 'Modifier' : 'Créer' }} un rôle</h2>
          <button class="close-btn" (click)="onClose.emit()">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <app-role-form
          [editMode]="editMode"
          [role]="role"
          (submitRole)="onSubmit($event)"
          (onCancel)="onClose.emit()"
        ></app-role-form>
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
      width: 100%;
      max-width: 800px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #eee;
    }

    .close-btn {
      background: none;
      border: none;
      color: #666;
      cursor: pointer;
      padding: 0.5rem;
      font-size: 1.25rem;
      transition: color 0.3s;

      &:hover {
        color: #333;
      }
    }
  `]
})
export class RoleDialogComponent {
  @Input() editMode = false;
  @Input() role?: Role;
  @Output() submitRole = new EventEmitter<Partial<Role>>();
  @Output() onClose = new EventEmitter<void>();

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('dialog-overlay')) {
      this.onClose.emit();
    }
  }

  onSubmit(roleData: Partial<Role>): void {
    this.submitRole.emit(roleData);
  }
}
```