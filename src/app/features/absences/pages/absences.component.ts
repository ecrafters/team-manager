import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AbsenceListComponent } from '../components/absence-list/absence-list.component';
import { AbsenceFormComponent } from '../components/absence-form/absence-form.component';
import { AbsenceService } from '../services/absence.service';
import { UserService } from '../../../core/services/user.service';
import { Absence } from '../models/absence.model';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-absences',
  standalone: true,
  imports: [CommonModule, RouterModule, AbsenceListComponent, AbsenceFormComponent],
  template: `
    <div class="absences-page">
      <header class="page-header">
        <div class="header-content">
          <h1>Gestion des absences</h1>
          <div class="header-actions">
           <!-- TODO 
            <a 
              *ngIf="isManager$ | async"
              routerLink="/absences/validation" 
              class="btn-validate"
              isActive="false"
            >
              <i class="fas fa-check-circle"></i>
              Valider les absences
            </a> -->
            <button class="btn-add" (click)="showForm = true" *ngIf="!showForm">
              <i class="fas fa-plus"></i> Nouvelle absence
            </button>
          </div>
        </div>
      </header>
      
      <div class="content-grid">
        <div class="main-content">
          <app-absence-list
            [absences]="absences"
            (onEdit)="onEditAbsence($event)"
            (onDelete)="onDeleteAbsence($event)"
          ></app-absence-list>
        </div>
        <aside class="side-content" *ngIf="showForm">
          <app-absence-form
            [editMode]="!!selectedAbsence"
            [absence]="selectedAbsence"
            (submitAbsence)="onSubmitAbsence($event)"
            (cancel)="onCancelForm()"
          ></app-absence-form>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .absences-page {
      padding: 2rem;
      background: #f9fafb;
      min-height: 100vh;
    }
  
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 2rem 2rem;
      width: 100%
    }
  
    h1 {
      font-size: 2rem;
      color: #2c3e50;
      font-weight: bold;
      margin-right: 15px;
    }
  
    .header-actions {
      display: flex;
      gap: 1rem;
    }
  
    .btn-validate {
      background: #27ae60;
      color: #ffffff;
      text-decoration: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: background 0.3s, box-shadow 0.3s;
    }
  
    .btn-validate:hover {
      background: #219a52;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
  
    .btn-add {
      background: #3498db;
      color: #ffffff;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: background 0.3s, transform 0.2s;
    }
  
    .btn-add:hover {
      background: #2980b9;
      transform: scale(1.05);
    }
  
    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }
  
    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }
  
    .main-content {
      background: #ffffff;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  
    .side-content {
      background: #ffffff;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      animation: slideIn 0.3s ease-out;
    }
  
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `]
  })
export class AbsencesComponent implements OnInit {
  absences: Absence[] = [];
  showForm = false;
  selectedAbsence: Absence | undefined;
  isManager$: Observable<boolean>;

  constructor(
    private absenceService: AbsenceService,
    private userService: UserService
  ) {
    this.isManager$ = this.userService.getCurrentUser().pipe(
      map(user => user?.role === 'admin' || user?.role === 'manager')
    );
  }

  ngOnInit(): void {
    this.loadAbsences();
  }

  private loadAbsences(): void {
    this.absenceService.getAbsences().subscribe({
      next: (absences) => this.absences = absences,
      error: (error) => console.error('Error loading absences:', error)
    });
  }

  onSubmitAbsence(absenceData: Partial<Absence>): void {
    if (this.selectedAbsence) {
      this.absenceService.updateAbsence(this.selectedAbsence.id!, absenceData)
        .subscribe({
          next: () => {
            this.resetForm();
            this.loadAbsences();
          },
          error: (error) => console.error('Error updating absence:', error)
        });
    } else {
      this.absenceService.addAbsence(absenceData as Omit<Absence, 'id'>)
        .subscribe({
          next: () => {
            this.resetForm();
            this.loadAbsences();
          },
          error: (error) => console.error('Error adding absence:', error)
        });
    }
  }

  onEditAbsence(absence: Absence): void {
    this.selectedAbsence = absence;
    this.showForm = true;
  }

  onDeleteAbsence(absence: Absence): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette absence ?')) {
      this.absenceService.deleteAbsence(absence.id!)
        .subscribe({
          next: () => this.loadAbsences(),
          error: (error) => console.error('Error deleting absence:', error)
        });
    }
  }

  onCancelForm(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.showForm = false;
    this.selectedAbsence = undefined;
  }
}