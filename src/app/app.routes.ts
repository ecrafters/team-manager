import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AbsencesComponent } from './features/absences/pages/absences.component';
import { AbsenceValidationPage } from './features/absences/pages/absence-validation/absence-validation.page';
import { WorkloadComponent } from './features/workload/pages/workload.component';
import { ProjectsComponent } from './features/projects/pages/projects.component';
import { ReportsComponent } from './features/reports/pages/reports.component';
import { TeamComponent } from './features/team/pages/team.component';
import { SettingsComponent } from './features/settings/pages/settings.component';
import { ProfilePage } from './features/profile/pages/profile.page';
import { AuthGuard } from './auth/auth.guard';
import { RoleGuard } from './auth/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'absences',
    children: [
      {
        path: '',
        component: AbsencesComponent
      },
      {
        path: 'validation',
        component: AbsenceValidationPage,
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'manager'] }
      }
    ],
    canActivate: [AuthGuard]
  },
  {
    path: 'workload',
    component: WorkloadComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'projects',
    component: ProjectsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'reports',
    component: ReportsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'team',
    component: TeamComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfilePage,
    canActivate: [AuthGuard]
  }
];