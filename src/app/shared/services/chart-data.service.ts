import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ChartData {
  labels: string[];
  data: number[];
}

@Injectable({
  providedIn: 'root'
})
export class ChartDataService {
  getProjectData(): Observable<ChartData> {
    return of({
      labels: ['Site Web', 'App Mobile', 'API', 'Dashboard'],
      data: [75, 45, 90, 20]
    });
  }

  getWorkloadData(): Observable<ChartData> {
    return of({
      labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'],
      data: [85, 72, 78, 95, 60]
    });
  }

  getAbsenceData(): Observable<ChartData> {
    return of({
      labels: ['Congés', 'Maladie', 'Télétravail', 'Autre'],
      data: [12, 5, 8, 3]
    });
  }
}