import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChartThemesService {
  readonly colors = {
    primary: 'rgba(52, 152, 219, 0.8)',
    success: 'rgba(46, 204, 113, 0.8)',
    warning: 'rgba(241, 196, 15, 0.8)',
    danger: 'rgba(231, 76, 60, 0.8)',
    info: 'rgba(155, 89, 182, 0.8)'
  };

  getProjectColors(): string[] {
    return [
      this.colors.primary,
      this.colors.success,
      this.colors.warning,
      this.colors.info
    ];
  }

  getWorkloadColor(): string {
    return this.colors.primary;
  }

  getAbsenceColors(): string[] {
    return [
      this.colors.success,
      this.colors.danger,
      this.colors.primary,
      this.colors.info
    ];
  }
}