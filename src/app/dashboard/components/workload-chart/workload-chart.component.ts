import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration } from 'chart.js/auto';

@Component({
  selector: 'app-workload-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <canvas #workloadChart></canvas>
    </div>
  `,
  styles: [`
    .chart-container {
      height: 300px;
      width: 100%;
    }
  `]
})
export class WorkloadChartComponent implements OnInit {
  @ViewChild('workloadChart') chartCanvas!: ElementRef;
  chart: Chart | undefined;

  ngOnInit(): void {
    this.createChart();
  }

  private createChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    
    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'],
        datasets: [{
          label: 'Charge moyenne (%)',
          data: [85, 72, 78, 95, 60],
          borderColor: 'rgba(52, 152, 219, 1)',
          tension: 0.4,
          fill: true,
          backgroundColor: 'rgba(52, 152, 219, 0.2)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }
}