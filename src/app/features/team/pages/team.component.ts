import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamMemberFormComponent } from '../components/team-member-form/team-member-form.component';
import { TeamFiltersComponent, TeamFilters } from '../components/team-filters/team-filters.component';
import { TeamService } from '../services/team.service';
import { TeamFilterService } from '../services/team-filter.service';
import { TeamMember } from '../models/team-member.model';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, TeamMemberFormComponent, TeamFiltersComponent],
  template: `
    <div class="team-page">
      <header class="page-header">
        <div class="header-content">
          <h1>Équipe</h1>
          <p class="subtitle">Gérez les membres de votre équipe</p>
        </div>
        <button class="btn-add" (click)="showForm = true" *ngIf="!showForm">
          <i class="fas fa-plus"></i> Nouveau membre
        </button>
      </header>

      <app-team-filters
        (filtersChange)="onFiltersChange($event)"
      ></app-team-filters>

      <div class="content-grid">
        <div class="main-content">
          <div class="team-grid">
            <div *ngFor="let member of filteredMembers" class="member-card">
              <div class="member-actions">
                <button class="btn-icon" (click)="onEditMember(member)" title="Modifier">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon delete" (click)="onDeleteMember(member)" title="Supprimer">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
              
              <div class="member-avatar">
                <img [src]="member.avatar || 'assets/default-avatar.png'" 
                     [alt]="member.firstName"
                     class="avatar">
              </div>
              
              <div class="member-info">
                <h3>{{ member.firstName }} {{ member.lastName }}</h3>
                <span class="role-badge" [ngClass]="member.role">
                  {{ member.role | titlecase }}
                </span>
                <p class="department" *ngIf="member.department">
                  <i class="fas fa-building"></i> {{ member.department }}
                </p>
                <p class="email">
                  <i class="fas fa-envelope"></i> {{ member.email }}
                </p>
                <p class="phone" *ngIf="member.phone">
                  <i class="fas fa-phone"></i> {{ member.phone }}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <aside class="side-content" *ngIf="showForm">
          <app-team-member-form
            [editMode]="!!selectedMember"
            [member]="selectedMember"
            (submitMember)="onSubmitMember($event)"
            (cancel)="onCancelForm()"
          ></app-team-member-form>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .team-page {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      padding: 1rem;
      background: #f5f7fa;
      min-height: 100vh;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: white;
      padding: 1rem 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .header-content {
      display: flex;
      flex-direction: column;
    }

    .header-content h1 {
      margin: 0;
      font-size: 2rem;
      color: #34495e;
    }

    .subtitle {
      margin: 0;
      color: #7f8c8d;
      font-size: 1rem;
    }

    .btn-add {
      background: #27ae60;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background-color 0.3s ease;
    }

    .btn-add:hover {
      background: #1e8449;
    }

    .content-grid {
      display: flex;
      gap: 2rem;
    }

    .main-content {
      flex: 3;
    }

    .side-content {
      flex: 1;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 1rem;
    }

    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .member-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 1rem;
      position: relative;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .member-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .member-actions {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      display: flex;
      gap: 0.5rem;
    }

    .btn-icon {
      background: #ecf0f1;
      border: none;
      border-radius: 50%;
      padding: 0.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s ease;
    }

    .btn-icon:hover {
      background: #bdc3c7;
    }

    .btn-icon.delete {
      background: #e74c3c;
      color: white;
    }

    .btn-icon.delete:hover {
      background: #c0392b;
    }

    .member-avatar {
      text-align: center;
      margin-bottom: 1rem;
    }

    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #f5f7fa;
    }

    .member-info {
      text-align: center;
    }

    .member-info h3 {
      margin: 0.5rem 0;
      font-size: 1.25rem;
      color: #2c3e50;
    }

    .role-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.85rem;
      color: white;
      text-transform: capitalize;
    }

    .role-badge.developer {
      background: #3498db;
    }

    .role-badge.manager {
      background: #9b59b6;
    }

    .role-badge.admin {
      background: #e67e22;
    }

    .department, .email, .phone {
      font-size: 0.9rem;
      color: #7f8c8d;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0.25rem 0;
    }

    .department i, .email i, .phone i {
      color: #bdc3c7;
    }

    @media (max-width: 768px) {
      .content-grid {
        flex-direction: column;
      }
    }
  `]
})
export class TeamComponent implements OnInit {
  showForm = false;
  selectedMember: TeamMember | undefined;
  teamMembers: TeamMember[] = [];
  filteredMembers: TeamMember[] = [];

  constructor(
    private teamService: TeamService,
    private filterService: TeamFilterService
  ) {}

  ngOnInit(): void {
    this.loadTeamMembers();
  }

  private loadTeamMembers(): void {
    this.teamService.getTeamMembers().subscribe({
      next: (members) => {
        this.teamMembers = members;
        this.filteredMembers = members;
      },
      error: (error) => console.error('Error loading team members:', error)
    });
  }

  onFiltersChange(filters: TeamFilters): void {
    this.filteredMembers = this.filterService.filterTeamMembers(this.teamMembers, filters);
  }

  onSubmitMember(memberData: Partial<TeamMember>): void {
    if (this.selectedMember) {
      this.teamService.updateMember(this.selectedMember.id!, memberData)
        .subscribe({
          next: () => {
            this.resetForm();
            this.loadTeamMembers();
          },
          error: (error) => console.error('Error updating member:', error)
        });
    } else {
      this.teamService.addMember(memberData as Omit<TeamMember, 'id'>)
        .subscribe({
          next: () => {
            this.resetForm();
            this.loadTeamMembers();
          },
          error: (error) => console.error('Error adding member:', error)
        });
    }
  }

  onEditMember(member: TeamMember): void {
    this.selectedMember = member;
    this.showForm = true;
  }

  onDeleteMember(member: TeamMember): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
      this.teamService.deleteMember(member.id!)
        .subscribe({
          next: () => this.loadTeamMembers(),
          error: (error) => console.error('Error deleting member:', error)
        });
    }
  }

  onCancelForm(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.showForm = false;
    this.selectedMember = undefined;
  }
}
