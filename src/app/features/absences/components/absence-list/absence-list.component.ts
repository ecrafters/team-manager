import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Absence } from '../../models/absence.model';
import { ItemCardComponent } from '../../../../shared/components/item-card/item-card.component';
import { AbsenceFiltersComponent, AbsenceFilters } from '../absence-filters/absence-filters.component';
import { AbsenceFilterService } from '../../services/absence-filter.service';
import { TeamService } from '../../../team/services/team.service';
import { TeamMember } from '../../../team/models/team-member.model';
import { MemberService } from '../../services/member.service';

@Component({
  selector: 'app-absence-list',
  standalone: true,
  imports: [CommonModule, ItemCardComponent, AbsenceFiltersComponent],
  template: `
    <div class="absence-list">
      <app-absence-filters
        [members]="members"
        (filtersChange)="onFiltersChange($event)"
      ></app-absence-filters>

      <div class="absences-grid">
        <app-item-card
          *ngFor="let absence of filteredAbsences"
          [title]="getAbsenceType(absence.type)"
          [badge]="getStatusLabel(absence.status)"
          [status]="absence.status"
          [footerContent]="getDateRange(absence)"
          (onEdit)="onEdit.emit(absence)"
          (onDelete)="onDelete.emit(absence)"
        >
          <div class="absence-content">
            <div class="member-info">
              <img [src]="memberService.getMemberAvatar(absence.userId)" 
                   [alt]="memberService.getMemberName(absence.userId)"
                   class="member-avatar">
              <span class="member-name">{{ memberService.getMemberName(absence.userId) }}</span>
            </div>
            
            <p *ngIf="absence.reason" class="reason">{{ absence.reason }}</p>
          </div>
        </app-item-card>
      </div>
    </div>
  `,
  styles: [`
    .absence-list {
      padding: 1rem;
    }

    .absences-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .absence-content {
      padding: 0.5rem 0;
    }

    .member-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
      padding: 0.5rem;
      background: #f8f9fa;
      border-radius: 4px;
    }

    .member-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }

    .member-name {
      font-weight: 500;
      color: #2c3e50;
    }

    .reason {
      color: #666;
      font-size: 0.875rem;
      font-style: italic;
      margin: 0;
    }
  `]
})
export class AbsenceListComponent implements OnInit {
  @Input() absences: Absence[] = [];
  @Output() onEdit = new EventEmitter<Absence>();
  @Output() onDelete = new EventEmitter<Absence>();

  members: TeamMember[] = [];
  filteredAbsences: Absence[] = [];

  constructor(
    private teamService: TeamService,
    private filterService: AbsenceFilterService,
    public memberService: MemberService
  ) {}

  ngOnInit(): void {
    this.loadMembers();
    this.filteredAbsences = this.absences;
  }

  ngOnChanges(): void {
    this.filteredAbsences = this.absences;
  }

  private loadMembers(): void {
    this.teamService.getTeamMembers().subscribe({
      next: (members) => this.members = members,
      error: (error) => console.error('Error loading members:', error)
    });
  }

  onFiltersChange(filters: AbsenceFilters): void {
    this.filteredAbsences = this.filterService.filterAbsences(this.absences, filters);
  }

  getAbsenceType(type: string): string {
    const types: Record<string, string> = {
      vacation: 'Congés',
      sick: 'Maladie',
      remote: 'Télétravail',
      other: 'Autre'
    };
    return types[type] || type;
  }

  getStatusLabel(status: string): string {
    const statuses: Record<string, string> = {
      pending: 'En attente',
      approved: 'Approuvé',
      rejected: 'Refusé'
    };
    return statuses[status] || status;
  }

  getDateRange(absence: Absence): string {
    const start = new Date(absence.startDate).toLocaleDateString();
    const end = new Date(absence.endDate).toLocaleDateString();
    return `Du ${start} au ${end}`;
  }
}