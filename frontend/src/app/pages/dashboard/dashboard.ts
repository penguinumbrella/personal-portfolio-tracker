import { Component, signal } from '@angular/core';
import { MetricCard } from '../../components/metric-card/metric-card';
import { DashboardTable } from '../../components/dashboard-table/dashboard-table';
import { InvestmentAccount } from '../../types/InvestmentAccounts';
import { InvestmentAccountService } from '../../services/InvestmentAccountService';
import { HoldingService } from '../../services/HoldingService';
import { SecurityService } from '../../services/SecurityService';

@Component({
  selector: 'app-dashboard',
  imports: [MetricCard, DashboardTable],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  recentAccounts = signal<InvestmentAccount[]>([]);
  totalAccounts = signal<number>(0);
  totalSecurities = signal<number>(0);
  totalHoldings = signal<number>(0);
  totalInvestedCost = signal<number>(0);
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
    private investmentAccountService: InvestmentAccountService,
    private holdingService: HoldingService,
    private securityService: SecurityService
  ) {}

  ngOnInit(): void {
    this.loadTotals();
    this.loadRecentAccounts();
    //this.loadRecentServices();
  }

  loadTotals(): void{ 
    // todo: add the other totals
    this.investmentAccountService.getUserInvestmentAccountTotal(1).subscribe({
      next: (data) => {

        this.totalAccounts.set(data);
      },
      error: (err) => {
        console.log(err);
      }
    })

    this.securityService.getUserSecurityTotal(1).subscribe({
      next: (data) => {

        this.totalSecurities.set(data);
      },
      error: (err) => {
        console.log(err);
      }
    })

    this.holdingService.getUserHoldingTotal(1).subscribe({
      next: (data) => {

        this.totalHoldings.set(data);
      },
      error: (err) => {
        console.log(err);
      }
    })

    this.holdingService.totalInvestedCost(1).subscribe({
      next: (data) => {

        this.totalInvestedCost.set(data);
      },
      error: (err) => {
        console.log(err);
      }
    })

    

  }

  loadRecentAccounts(): void {
    this.investmentAccountService.getRecentAccounts(1).subscribe({
      next: (data) => {
        //console.log(data);
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
