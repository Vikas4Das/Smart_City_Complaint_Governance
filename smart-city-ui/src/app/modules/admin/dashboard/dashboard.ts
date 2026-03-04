import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class AdminDashboardComponent {
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Pending', 'In Progress', 'Resolved'],
    datasets: [{
      data: [30, 20, 50],
      backgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0']
    }]
  };
  public pieChartType: ChartType = 'pie';
}
