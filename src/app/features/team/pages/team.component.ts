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
  styles: [/* ... existing styles ... */]
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