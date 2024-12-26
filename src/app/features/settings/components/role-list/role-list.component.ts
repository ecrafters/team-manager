```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../services/role.service';
import { RoleWithUserCount } from '../../models/role.model';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="role-list">
      <div class="list-header">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Rechercher un rôle..."
            [(ngModel)]="searchTerm"
            (ngModelChange)="filterRoles()"
          >
        </div>
        <button class="btn-add" (click)="onAddRole()">
          <i class="fas fa-plus"></i>
          Nouveau rôle
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Description</th>
            <th>Utilisateurs</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let role of filteredRoles">
            <td>{{ role.name }}</td>
            <td>{{ role.description }}</td>
            <td>{{ role.userCount }} utilisateur(s)</td>
            <td>
              <span class="badge" [class.default]="role.isDefault">
                {{ role.isDefault ? 'Standard' : 'Personnalisé' }}
              </span>
            </td>
            <td class="actions">
              <button class="btn-icon" (click)="onEditRole(role)">
                <i class="fas fa-edit"></i>
              </button>
              <button 
                class="btn-icon delete" 
                [disabled]="role.isDefault"
                (click)="onDeleteRole(role)"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .role-list {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .search-box {
      position: relative;
      width: 300px;

      i {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: #666;
      }

      input {
        width: 100%;
        padding: 0.75rem 1rem 0.75rem 2.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.875rem;
      background: #e3f2fd;
      color: #2196f3;

      &.default {
        background: #e8f5e9;
        color: #4caf50;
      }
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-icon {
      background: none;
      border: none;
      color: #666;
      cursor: pointer;
      padding: 0.5rem;

      &:hover {
        color: #333;
      }

      &.delete:hover {
        color: #e74c3c;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  `]
})
export class RoleListComponent implements OnInit {
  roles: RoleWithUserCount[] = [];
  filteredRoles: RoleWithUserCount[] = [];
  searchTerm = '';

  constructor(private roleService: RoleService) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  private loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        this.filterRoles();
      },
      error: (error) => console.error('Error loading roles:', error)
    });
  }

  filterRoles(): void {
    if (!this.searchTerm) {
      this.filteredRoles = this.roles;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredRoles = this.roles.filter(role => 
      role.name.toLowerCase().includes(term) ||
      role.description.toLowerCase().includes(term)
    );
  }

  onAddRole(): void {
    // Implement role creation dialog
  }

  onEditRole(role: RoleWithUserCount): void {
    // Implement role edit dialog
  }

  onDeleteRole(role: RoleWithUserCount): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le rôle "${role.name}" ?`)) {
      this.roleService.deleteRole(role.id!).subscribe({
        next: () => this.loadRoles(),
        error: (error) => console.error('Error deleting role:', error)
      });
    }
  }
}
```