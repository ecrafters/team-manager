```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleListComponent } from '../../components/role-list/role-list.component';
import { RoleDialogComponent } from '../../components/role-dialog/role-dialog.component';
import { RoleService } from '../../services/role.service';
import { Role, RoleWithUserCount } from '../../models/role.model';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, RoleListComponent, RoleDialogComponent],
  template: `
    <div class="roles-page">
      <header class="page-header">
        <h1>Gestion des rôles</h1>
        <p class="subtitle">Gérez les rôles et les permissions des utilisateurs</p>
      </header>

      <app-role-list
        (onAddRole)="showDialog()"
        (onEditRole)="showDialog($event)"
      ></app-role-list>

      <app-role-dialog
        *ngIf="showRoleDialog"
        [editMode]="!!selectedRole"
        [role]="selectedRole"
        (submitRole)="handleRoleSubmit($event)"
        (onClose)="closeDialog()"
      ></app-role-dialog>
    </div>
  `,
  styles: [`
    .roles-page {
      padding: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .subtitle {
      color: #666;
      margin-top: 0.5rem;
    }
  `]
})
export class RolesPage {
  showRoleDialog = false;
  selectedRole?: RoleWithUserCount;

  constructor(private roleService: RoleService) {}

  showDialog(role?: RoleWithUserCount): void {
    this.selectedRole = role;
    this.showRoleDialog = true;
  }

  closeDialog(): void {
    this.showRoleDialog = false;
    this.selectedRole = undefined;
  }

  handleRoleSubmit(roleData: Partial<Role>): void {
    if (this.selectedRole) {
      this.roleService.updateRole(this.selectedRole.id!, roleData).subscribe({
        next: () => this.closeDialog(),
        error: (error) => console.error('Error updating role:', error)
      });
    } else {
      this.roleService.createRole(roleData as Omit<Role, 'id'>).subscribe({
        next: () => this.closeDialog(),
        error: (error) => console.error('Error creating role:', error)
      });
    }
  }
}
```