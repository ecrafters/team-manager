import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { ChartConfigService } from '../../../shared/services/chart-config.service';
import { ChartDataService } from '../../../shared/services/chart-data.service';

@Component({
  selector: 'app-project-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <canvas #projectChart></canvas>
    </div>
  `,
  styles: [`
    .chart-container {
      height: 300px;
      width: 100%;
    }
  `]
})
export class ProjectChartComponent implements OnInit {
  @ViewChild('projectChart') chartCanvas!: ElementRef;
  private chart: Chart | undefined;

  constructor(
    private chartConfig: ChartConfigService,
    private chartData: ChartDataService
  ) {}

  ngOnInit(): void {
    this.createChart();
  }

  private createChart(): void {
    this.chartData.getProjectData().subscribe(data => {
      const ctx = this.chartCanvas.nativeElement.getContext('2d');
      
      const config: ChartConfiguration = {
        type: 'bar',
        data: {
          labels: data.labels,
          datasets: [{
            label: 'Progression (%)',
            data: data.data,
            backgroundColor: [
              'rgba(52, 152, 219, 0.8)',
              'rgba(46, 204, 113, 0.8)',
              'rgba(155, 89, 182, 0.8)',
              'rgba(241, 196, 15, 0.8)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          ...this.chartConfig.getBaseConfig(),
          ...this.chartConfig.getScalesConfig()
        }
      };

      this.chart = new Chart(ctx, config);
    });
  }
}