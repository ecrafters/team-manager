
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardStatsComponent } from './components/dashboard-stats/dashboard-stats.component';
import { MemberWorkloadComponent } from './components/member-workload/member-workload.component';
import { ProjectAnalyticsComponent } from './components/project-analytics/project-analytics.component';
import { TeamAnalyticsComponent } from './components/team-analytics/team-analytics.component';
import { AbsenceAnalyticsComponent } from './components/absence-analytics/absence-analytics.component';
import { DashboardFiltersComponent, DashboardFilters } from './components/dashboard-filters/dashboard-filters.component';
import { DashboardService } from './services/dashboard.service';
import { DashboardFilterService } from './services/dashboard-filter.service';
import { DashboardViewModel } from './models/dashboard-view.model';
import { DashboardStateService } from './services/dashboard-state.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DashboardStatsComponent,
    MemberWorkloadComponent,
    ProjectAnalyticsComponent,
    TeamAnalyticsComponent,
    AbsenceAnalyticsComponent,
    DashboardFiltersComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  viewModel!: DashboardViewModel;

  constructor(
    private dashboardService: DashboardService,
    private filterService: DashboardFilterService,
    private stateService: DashboardStateService
  ) {
    this.viewModel = this.stateService.getInitialState();
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  onFiltersChange(filters: DashboardFilters): void {
    this.stateService.updateFilters(filters);
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.dashboardService.getDashboardStats().subscribe({
      next: (data) => {
        const filters = this.stateService.getCurrentFilters();
        const filteredData = filters ? this.filterService.applyFilters(data, filters) : data;
        this.viewModel = this.stateService.updateState(filteredData);
      },
      error: (error) => console.error('Error loading dashboard stats:', error)
    });
  }
}