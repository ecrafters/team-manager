import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="reports-page">
      <header class="page-header">
        <h1>Rapports</h1>
      </header>
      
      <div class="content-grid">
        <!-- Contenu à venir -->
        <p>Module en cours de développement</p>
      </div>
    </div>
  `,
  styles: [`
    .reports-page {
      padding: 1rem;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .content-grid {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `]
})
export class ReportsComponent {}