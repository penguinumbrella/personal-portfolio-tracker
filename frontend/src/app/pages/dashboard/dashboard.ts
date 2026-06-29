import { Component } from '@angular/core';
import { MetricCard } from '../../components/metric-card/metric-card';
import { DashboardTable } from '../../components/dashboard-table/dashboard-table';
import { UserHandle } from '../../components/user-handle/user-handle';

@Component({
  selector: 'app-dashboard',
  imports: [MetricCard, DashboardTable, UserHandle],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  recentAccounts = [
    { name: "Brokerage", date: "10-21-26", totalAmount: "$24,000" },
    { name: "IRA", date: "10-21-26", totalAmount: "$28,000" }
  ];
  
  recentSecurities = [
    { name: 'AAPL' },
    { name: 'TSLA' }
  ];
}
