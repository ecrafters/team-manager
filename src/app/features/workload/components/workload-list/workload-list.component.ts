import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Workload } from '../../../../core/models/firestore/workload.model';
import { WorkloadItemComponent } from '../workload-item/workload-item.component';
import { WorkloadFiltersComponent, WorkloadFilters } from '../workload-filters/workload-filters.component';
import { WorkloadFilterService } from '../../services/workload-filter.service';
import { TeamService } from '../../../team/services/team.service';
import { ProjectService } from '../../../projects/services/project.service';
import { TeamMember } from '../../../team/models/team-member.model';
import { Project } from '../../../projects/models/project.model';

@Component({
  selector: 'app-workload-list',
  standalone: true,
  imports: [CommonModule, WorkloadItemComponent, WorkloadFiltersComponent],
  template: `
    <div class="workload-list">
      <app-workload-filters
        [members]="members"
        [projects]="projects"
        (filtersChange)="onFiltersChange($event)"
      ></app-workload-filters>

      <div class="workload-grid">
        <app-workload-item
          *ngFor="let workload of filteredWorkloads"
          [workload]="workload"
          (edit)="onEdit.emit($event)"
          (delete)="onDelete.emit($event)"
        ></app-workload-item>
      </div>
    </div>
  `,
  styles: [`
    .workload-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
    }
  `]
})
export class WorkloadListComponent implements OnInit {
  @Input() workloads: Workload[] = [];
  @Output() onEdit = new EventEmitter<Workload>();
  @Output() onDelete = new EventEmitter<Workload>();

  members: TeamMember[] = [];
  projects: Project[] = [];
  filteredWorkloads: Workload[] = [];

  constructor(
    private teamService: TeamService,
    private projectService: ProjectService,
    private filterService: WorkloadFilterService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.filteredWorkloads = this.workloads;
  }

  ngOnChanges(): void {
    this.filteredWorkloads = this.workloads;
  }

  private loadData(): void {
    this.teamService.getTeamMembers().subscribe({
      next: (members) => this.members = members,
      error: (error) => console.error('Error loading members:', error)
    });

    this.projectService.getProjects().subscribe({
      next: (projects) => this.projects = projects,
      error: (error) => console.error('Error loading projects:', error)
    });
  }

  onFiltersChange(filters: WorkloadFilters): void {
    this.filteredWorkloads = this.filterService.filterWorkloads(this.workloads, filters);
  }
}