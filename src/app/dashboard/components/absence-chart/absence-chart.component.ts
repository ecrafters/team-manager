import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration } from 'chart.js/auto';

@Component({
  selector: 'app-absence-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <canvas #absenceChart></canvas>
    </div>
  `,
  styles: [`
    .chart-container {
      height: 300px;
      width: 100%;
    }
  `]
})
export class AbsenceChartComponent implements OnInit {
  @ViewChild('absenceChart') chartCanvas!: ElementRef;
  chart: Chart | undefined;

  ngOnInit(): void {
    this.createChart();
  }

  private createChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    
    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: ['Congés', 'Maladie', 'Télétravail', 'Autre'],
        datasets: [{
          data: [12, 5, 8, 3],
          backgroundColor: [
            'rgba(46, 204, 113, 0.8)',
            'rgba(231, 76, 60, 0.8)',
            'rgba(52, 152, 219, 0.8)',
            'rgba(155, 89, 182, 0.8)'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    };

    this.chart = new Chart(ctx, config);
  }
}