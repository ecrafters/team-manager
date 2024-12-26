import { Injectable } from '@angular/core';
import { ChartConfiguration } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class ChartConfigService {
  getBaseConfig(): Partial<ChartConfiguration['options']> {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    };
  }

  getScalesConfig(maxValue = 100): Partial<ChartConfiguration['options']> {
    return {
      scales: {
        y: {
          beginAtZero: true,
          max: maxValue
        }
      }
    };
  }
}