import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="user-list">
      <div class="filters">
        <div class="search-box">
          <input 
            type="text" 
            [(ngModel)]="searchTerm" 
            (ngModelChange)="filterUsers()"
            placeholder="Rechercher un utilisateur..."
            class="search-input"
          >
        </div>
        <div class="role-filter">
          <select [(ngModel)]="selectedRole" (ngModelChange)="filterUsers()">
            <option value="">Tous les rôles</option>
            <option value="admin">Administrateur</option>
            <option value="manager">Manager</option>
            <option value="developer">Développeur</option>
          </select>
        </div>
      </div>

      <table class="users-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Date d'inscription</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let user of filteredUsers">
            <td>{{ user.firstName }} {{ user.lastName }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span class="role-badge" [ngClass]="user.role">
                {{ user.role | titlecase }}
              </span>
            </td>
            <td>{{ user.createdAt | date:'dd/MM/yyyy' }}</td>
            <td class="actions">
              <button class="btn-icon" (click)="onEdit(user)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn-icon delete" (click)="onDelete(user)">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .user-list {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .search-input {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      width: 300px;
    }

    .users-table {
      width: 100%;
      border-collapse: collapse;
    }

    .users-table th,
    .users-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    .role-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .role-badge.admin {
      background: #e3f2fd;
      color: #2196f3;
    }

    .role-badge.manager {
      background: #e8f5e9;
      color: #4caf50;
    }

    .role-badge.developer {
      background: #fff3e0;
      color: #ff9800;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-icon {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      color: #666;
    }

    .btn-icon:hover {
      color: #333;
    }

    .btn-icon.delete:hover {
      color: #e74c3c;
    }
  `]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';
  selectedRole = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filterUsers();
      },
      error: (error) => console.error('Error loading users:', error)
    });
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesRole = !this.selectedRole || user.role === this.selectedRole;
      
      return matchesSearch && matchesRole;
    });
  }

  onEdit(user: User): void {
    // Implement edit logic
  }

  onDelete(user: User): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.firstName} ${user.lastName} ?`)) {
      this.userService.deleteUser(user.id!).subscribe({
        next: () => this.loadUsers(),
        error: (error) => console.error('Error deleting user:', error)
      });
    }
  }
}