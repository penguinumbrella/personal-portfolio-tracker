import { Component, signal } from '@angular/core';
import { MetricCard } from '../../components/metric-card/metric-card';
import { DashboardTable } from '../../components/dashboard-table/dashboard-table';
import { InvestmentAccount } from '../../types/InvestmentAccounts';
import { InvestmentAccountService } from '../../services/InvestmentAccountService';

@Component({
  selector: 'app-dashboard',
  imports: [MetricCard, DashboardTable],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  recentAccounts = signal<InvestmentAccount[]>([]);
  // need securities observer set up
  //rSecurities = signal<Security[]>([]);

  //todo: implement total things in backend sql
  /**
   * totals:
   * account
   * security
   * holding
   * invested cost
   */

  constructor(
    private investmentAccountService: InvestmentAccountService
  ) {}

  ngOnInit(): void {
    this.loadRecentAccounts();
    //this.loadRecentServices();
  }

  loadRecentAccounts(): void {
    this.investmentAccountService.getAllInvestmentAccounts(1).subscribe({
      next: (data) => {
        console.log(data);
        this.recentAccounts.set(data);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  
  // recentAccounts = [
  //   { name: "Brokerage", date: "10-21-26", totalAmount: "$24,000" },
  //   { name: "IRA", date: "10-21-26", totalAmount: "$28,000" }
  // ];
  
  recentSecurities = [
    { name: 'AAPL' },
    { name: 'TSLA' }
  ];
}
